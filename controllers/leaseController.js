import db from "../models/index.js";

const { Lease } = db;

const handleError = (res, err) => {
    console.error('Operation failed:', err);
    const status = err.name === 'SequelizeValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message });
};

const leaseController = {
    getAllLeases: async (req, res) => {
        try {
            const leases = await Lease.findAll({
                include: [{
                    model: db.Customer,
                    attributes: ['id', 'name', 'email', 'phone', ]
                }, {
                    model: db.Property,
                    attributes: ['id', 'name', 'address', 'city', 'state', 'zip']
                }],
            });
            res.status(200).json(leases);
        } catch (err) {
            handleError(res, err);
        }
    },

    createLease: async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Request body cannot be empty" });
            }
            const lease = await Lease.create(req.body);
            res.status(201).json(lease);
        } catch (err) {
            handleError(res, err);
        }
    },

    updateLease: async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Request body cannot be empty" });
            }
            const lease = await Lease.findByPk(req.params.id);
            if (!lease) {
                return res.status(404).json({ error: "Lease not found" });
            }
            await lease.update(req.body);
            res.status(200).json(lease);
        } catch (err) {
            handleError(res, err);
        }
    },

    deleteLease: async (req, res) => {
        try {
            const lease = await Lease.findByPk(req.params.id);
            if (!lease) {
                return res.status(404).json({ error: "Lease not found" });
            }
            await lease.destroy();
            res.status(200).json({ message: "Lease deleted" });
        } catch (err) {
            handleError(res, err);
        }
    },

    getLeaseById: async (req, res) => {
        try {
            const lease = await Lease.findByPk(req.params.id, {
                // Add specific attributes if you don't need all fields
                // attributes: ['id', 'startDate', 'endDate', 'amount']
            });
            if (!lease) {
                return res.status(404).json({ error: "Lease not found" });
            }
            res.status(200).json(lease);
        } catch (err) {
            handleError(res, err);
        }
    }
};

export default leaseController;
