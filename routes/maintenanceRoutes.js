import express from 'express';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} from '../controllers/maintenanceController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllRequests);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getRequestById);
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Tenant']), createRequest);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateRequest);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteRequest);

export default router;
