
// src/routes/ledger.routes.js
import express from 'express';
import db from '../models/index.js';
import * as ledgerController from "../controllers/ledgerController.js";

const router = express.Router();


router.get('/', async (req, res) => {
    const { tenantId, propertyId } = req.query;

    try {
        const payments = await db.Payment.findAll({
            where: tenantId ? { tenantId } : {},
            raw: true
        });

        const leases = await db.Lease.findAll({
            where: tenantId ? { tenantId } : propertyId ? { propertyId } : {},
            raw: true
        });

        let entries = [];

        leases.forEach((lease) => {
            const rentDate = new Date(lease.startDate);
            while (rentDate <= new Date(lease.endDate)) {
                entries.push({
                    date: new Date(rentDate),
                    description: 'Rent Charged',
                    debit: lease.rentAmount,
                    credit: 0
                });
                rentDate.setMonth(rentDate.getMonth() + 1);
            }
        });

        payments.forEach((pmt) => {
            entries.push({
                date: pmt.createdAt,
                description: `Payment - ${pmt.method}`,
                debit: 0,
                credit: pmt.amount
            });
        });

        entries.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(entries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate ledger' });
    }

});

router.get('/:tenantId', ledgerController.getLedgerForTenant);
router.get('/:tenantId/balance', ledgerController.getBalanceForTenant);
router.post('/charge', ledgerController.addCharge);
router.post('/payment', ledgerController.addPayment);
// router.get('/charges', ledgerController.getAllCharges);
// router.get('/payments', ledgerController.getAllPayments);
// router.get('/transactions', ledgerController.getAllTransactions);
router.get('/preview-statement/:tenantId', ledgerController.createTenantPaymentStatement);
router.post('/send-statement/:tenantId', ledgerController.sendTenantStatement);
router.get('/send-receipt/:paymentId', ledgerController.sendPaymentReceipt);

export default router;