import db from "../models/index.js";

const { Payment } = db;
const paymentController = {
    getAllPayments: async (req, res) => {
        try { const properties = await Payment.findAll(); res.json(properties); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    createPayment: async (req, res) => {
        try { const payment = await Payment.create(req.body); res.status(201).json(payment); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    updatePayment: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            await payment.update(req.body);
            res.json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deletePayment: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            await payment.destroy();
            res.json({ message: "Payment deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    createPayment: async (req, res) => {
        try {
            const payment = await Payment.create(req.body);
            res.status(201).json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updatePayment: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            await payment.update(req.body);
            res.json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deletePayment: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            await payment.destroy();
            res.json({ message: "Payment deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    sendPaymentReceipt: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            // Logic to generate and send receipt
            res.json({ message: "Payment receipt sent successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    sendTenantPaymentStatement: async (req, res) => {
        try {
            const payments = await Payment.findAll({
                where: { tenantId: req.params.tenantId }
            });
            // Logic to generate and send statement
            res.json({ message: "Payment statement sent successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getTenantBalances: async (req, res) => {
        try {
            const balances = await Payment.findAll({
                where: { tenantId: req.params.tenantId },
                attributes: ['balance']
            });
            res.json(balances);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    viewTenantStatement: async (req, res) => {
        try {
            const payments = await Payment.findAll({
                where: { tenantId: req.params.tenantId },
                order: [['createdAt', 'DESC']]
            });
            res.json(payments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getPaymentById: async (req, res) => {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Payment not found" });
            res.json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default paymentController