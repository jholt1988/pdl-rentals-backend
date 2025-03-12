import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, roleMiddleware(['Admin']), getAdminStats);

export default router;
