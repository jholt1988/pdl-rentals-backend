const { Maintenance } = require("../models/request")

const maintenanceRequestController = {
    getAllMaintenanceRequest: async (req, res) => {
        try { const properties = await Maintenance.findAll(); res.json(properties); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    createMaintenanceRequest: async (req, res) => {
        try { const request = await Maintenance.create(req.body); res.status(201).json(request); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateMaintenanceRequest: async (req, res) => {
        try {
            const request = await Maintenance.findByPk(req.params.id);
            if (!request) return res.status(404).json({ error: "Maintenance not found" });
            await request.update(req.body);
            res.json(request);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteMaintenanceRequest: async (req, res) => {
        try {
            const request = await Maintenance.findByPk(req.params.id);
            if (!request) return res.status(404).json({ error: "Maintenance not found" });
            await request.destroy();
            res.json({ message: "Maintenance deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default maintenanceRequestController