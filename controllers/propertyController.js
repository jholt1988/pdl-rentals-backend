const {Property} =  require("../models/property")

const propertyController = {
    getAllProperties: async (req, res) => {
        try { const properties = await Property.findAll(); res.json(properties); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    createProperty: async (req, res) => {
        try { const property = await Property.create(req.body); res.status(201).json(property); }
        catch (err) { res.status(500).json({ error: err.message }); }
    },
    updateProperty: async (req, res) => {
        try {
            const property = await Property.findByPk(req.params.id);
            if (!property) return res.status(404).json({ error: "Property not found" });
            await property.update(req.body);
            res.json(property);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteProperty: async (req, res) => {
        try {
            const property = await Property.findByPk(req.params.id);
            if (!property) return res.status(404).json({ error: "Property not found" });
            await property.destroy();
            res.json({ message: "Property deleted" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default propertyController