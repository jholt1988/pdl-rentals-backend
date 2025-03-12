const {Property} =  require("../models/payment")

const paymentController = {
    getAllPayments: async (req, res) => {
        try { const properties = await Property.findAll(); res.json(properties); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    createProperty: async (req, res) => {
        try { const payment = await Property.create(req.body); res.status(201).json(payment); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateProperty: async (req, res) => {
        try {
            const payment = await Property.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Property not found" });
            await payment.update(req.body);
            res.json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteProperty: async (req, res) => {
        try {
            const payment = await Property.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: "Property not found" });
            await payment.destroy();
            res.json({ message: "Property deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default paymentController