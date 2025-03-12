import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllProperties);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getPropertyById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), createProperty);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateProperty);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteProperty);

export default router;
