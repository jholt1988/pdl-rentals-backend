import db from '../models/index.js';

const { Contractor } = db;
export const getAllContractors = async (req, res) => {
    try {
        const contractors = await Contractor.findAll();
        res.status(200).json(contractors);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contractors', error });
    }
};

export const getContractorById = async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contractor', error });
    }
};

export const createContractor = async (req, res) => {
    try {
        const contractor = await Contractor.create(req.body);
        res.status(201).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contractor', error });
    }
};

export const updateContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        await contractor.update(req.body);
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contractor', error });
    }
};

export const deleteContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        await contractor.destroy();
        res.status(200).json({ message: 'Contractor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contractor', error });
    }
};

// Implement additional functions as needed
// For example, you may want to implement a function to get all contractors for a specific property
