import { auth } from 'google-auth-library';
import db from '../models/index.js';
import { sendReceipt, sendPaymentStatement, sendMailPaymentStatement, authSend, gmailCreateDraftWithAttachment } from '../services/emailService.js';
import { generatePaymentStatement } from "../services/pdfService.js";   
const { LedgerEntry, Tenant, Lease } = db;

export const getLedgerForTenant = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const entries = await LedgerEntry.findAll({
      where: { tenantId },
      order: [['date', 'ASC']],
    });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ledger', error });
  }
};

export const addCharge = async (req, res) => {
  try {
    const { tenantId, leaseId, amount, description, date } = req.body;
    const entry = await LedgerEntry.create({
      tenantId,
      leaseId,
      type: 'charge',
      amount,
      description,
      date: date || new Date(),
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding charge', error });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { tenantId, leaseId, amount, description, date } = req.body;
    const entry = await LedgerEntry.create({
      tenantId,
      leaseId,
      type: 'payment',
      amount,
      description,
      date: date || new Date(),
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment', error });
  }
};

export const getBalanceForTenant = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const entries = await LedgerEntry.findAll({ where: { tenantId } });
    const totalCharges = entries
      .filter((e) => e.type === 'charge')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const totalPayments = entries
      .filter((e) => e.type === 'payment')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const balance = totalCharges - totalPayments;
    res.status(200).json({ tenantId, totalCharges, totalPayments, balance });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating balance', error });
    }
    
};

export const sendPaymentReceipt = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) throw new Error('Payment not found');
        const tenant = await Tenant.findByPk(payment.leaseId);
        if (!tenant) throw new Error('Tenant not found');
        await sendReceipt(tenant.email, payment.amount, payment.date);
    } catch (error) {
        console.error('Error sending payment receipt:', error);
    }
}

export const createTenantPaymentStatement = async (req, res) => {
  router.get('/tenants/:id/statement', async (req, res) => {
    try {
      const tenantId = req.params.id;
      const tenant = await db.Tenant.findByPk(tenantId);
      const payments = await db.Payment.findAll({ where: { tenantId }, raw: true });
      const leases = await db.Lease.findAll({ where: { tenantId }, raw: true });

      const entries = [];

      leases.forEach((lease) => {
        const rentDate = new Date(lease.startDate);
        while (rentDate <= new Date(lease.endDate)) {
          entries.push({
            date: new Date(rentDate),
            description: 'Rent Charge',
            debit: lease.rentAmount,
            credit: 0
          });
          rentDate.setMonth(rentDate.getMonth() + 1);
        }
      });

      payments.forEach((p) => {
        entries.push({
          date: p.createdAt,
          description: `Payment - ${p.method}`,
          debit: 0,
          credit: p.amount
        });
      });

      entries.sort((a, b) => new Date(a.date) - new Date(b.date));

      const pdfBuffer = await generatePaymentStatement({ tenant, entries });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="statement-${tenant.id}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate statement' });
    }
  });

export const sendTenantStatement = async (req, res) => {
  try {
   const tenantId = req.params.tenantId
    // Generate PDF file (choose an outputPath, e.g. tem   porary file)
    const entries = await LedgerEntry.findAll({ where: { tenantId } });
    const tenant = await Tenant.findByPk(tenantId);
    
    const outputPath = `./tmp/Payment_Statement_${tenant.name}${Date.now()}.pdf`;
 const statement = generatePaymentStatement({ tenant, entries }, outputPath);
    console.log('Statement generated:', statement);
    // Authorize and send email with attachment
     
    await sendMailPaymentStatement();
    await gmailCreateDraftWithAttachment(tenant.email, process.env.EMAIL_USER, statement)
    res.status(200).json({ message: 'Statement emailed successfully' });
  } catch (err) {
    console.error('Error sending tenant statement:', err);
    res.status(500).json({ error: 'Email sending failed' });
  }
};

