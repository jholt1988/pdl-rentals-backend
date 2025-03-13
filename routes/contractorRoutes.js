import express from 'express';
import contractorController from '../controllers/contractorController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const { getAllContractors, getContractorById, createContractor, updateContractor, deleteContractor, assignRequest, updateInvoice, getInvoices } = contractorController;

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllContractors);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getContractorById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), createContractor);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateContractor);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteContractor);
router.put('/:id/assign', authMiddleware, roleMiddleware(['Admin']), assignRequest);
router.put('/:id/invoices/:invoiceId', authMiddleware, roleMiddleware(['Admin']), updateInvoice);
router.get('/:id/invoices', authMiddleware, roleMiddleware(['Admin']), getInvoices);

export default router;
