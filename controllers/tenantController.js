import db from '../models/index.js';

const { Tenant } = db;
export const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll();
        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tenants', error });
    }
};

export const getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tenant', error });
    }
};

export const createTenant = async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);
        res.status(201).json(tenant);
    } catch (error) {
        res.status(500).json({ message: 'Error creating tenant', error });
    }
};

export const updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
        await tenant.update(req.body);
        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating tenant', error });
    }
};

export const deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
        await tenant.destroy();
        res.status(200).json({ message: 'Tenant deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tenant', error });
    }
};
