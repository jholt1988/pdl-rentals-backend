import db from "../models/index.js";

const { Lease } = db;
const leaseController = {
    getAllLeases: async (req, res) => {
        try { const properties = await Lease.findAll(); res.json(properties); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    createLease: async (req, res) => {
        try { const lease = await Lease.create(req.body); res.status(201).json(lease); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateLease: async (req, res) => {
        try {
            const lease = await Lease.findByPk(req.params.id);
            if (!lease) return res.status(404).json({ error: "Lease not found" });
            await lease.update(req.body);
            res.json(lease);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteLease: async (req, res) => {
        try {
            const lease = await Lease.findByPk(req.params.id);
            if (!lease) return res.status(404).json({ error: "Lease not found" });
            await lease.destroy();
            res.json({ message: "Lease deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }, 
    getLeaseById: async (req, res) => {
        try {
            const lease = await Lease.findByPk(req.params.id);
            if (!lease) return res.status(404).json({ error: "Lease not found" });
            res.json(lease);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default leaseController