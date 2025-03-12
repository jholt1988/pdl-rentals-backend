import express from 'express';
import {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllTenants);
router.get('/:id', authMiddleware, roleMiddleware(['Admin', 'Tenant']), getTenantById);
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Tenant']), createTenant);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateTenant);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteTenant);

export default router;
