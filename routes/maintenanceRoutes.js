import express from 'express';
import maitenanceController from '../controllers/maintenanceController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const { getAllMaintenanceRequest, getMaintenanceRequestById, createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } = maitenanceController;

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllMaintenanceRequest);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getMaintenanceRequestById);
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Tenant']), createMaintenanceRequest);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateMaintenanceRequest);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteMaintenanceRequest);

export default router;
