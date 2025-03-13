import db from '../models/index.js';
import * as res from 'express/lib/response';

const { Contractor } = db;

const contractorController = {
   
  getAllContractors: async (req, res) => {
    try {
        const contractors = await Contractor.findAll();
        res.status(200).json(contractors);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contractors', error });
    }
    },

 getContractorById: async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contractor', error });
    }
},

 createContractor: async (req, res) => {
    try {
        const contractor = await Contractor.create(req.body);
        res.status(201).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contractor', error });
    }
},

 updateContractor : async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        await contractor.update(req.body);
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contractor', error });
    }
},

 deleteContractor: async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.params.id);
        if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
        await contractor.destroy();
        res.status(200).json({ message: 'Contractor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contractor', error });
    }
    },
    assignRequest: async (req, res) => {
     
    const { contractorId, propertyId } = req.body;
    try {
        const contractor = await Contractor.findByPk(contractorId);
        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }

        // Assign the property to the contractor
        await contractor.addProperty(propertyId);

        res.status(200).json({ message: 'Property assigned to contractor successfully' });
    } catch (error) {
        console.error('Error assigning property to contractor:', error);
        res.status(500).json({ message: 'Error assigning property to contractor', error });
    }
    },
    updateInvoice: async (req, res) => {
        const { contractorId, propertyId } = req.body;
        try {
            const contractor = await Contractor.findByPk(contractorId);
            if (!contractor) {
                return res.status(404).json({ message: 'Contractor not found' });
            }
    
            // Update the invoice for the contractor
            await contractor.updateInvoice(propertyId);
    
            res.status(200).json({ message: 'Invoice updated successfully' });
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).json({ message: 'Error updating invoice', error });
        }
    }, 
    getInvoice: async (req, res) => {
        const { contractorId, propertyId } = req.body;
        try {
            const contractor = await Contractor.findByPk(contractorId);
            if (!contractor) {
                return res.status(404).json({ message: 'Contractor not found' });
            }

            // Get the invoice for the contractor
            const invoice = await contractor.getInvoice(propertyId);

            res.status(200).json(invoice);
        } catch (error) {
            console.error('Error getting invoice:', error);
            res.status(500).json({ message: 'Error getting invoice', error });
        }
    }
    
    // Add other controller functions as needed
};

// Implement additional functions as needed
// For example, you may want to implement a function to get all contractors for a specific property
export default contractorController;