import express from 'express';
import {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease,
} from '../controllers/leaseController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllLeases);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getLeaseById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), createLease);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateLease);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteLease);

export default router;
