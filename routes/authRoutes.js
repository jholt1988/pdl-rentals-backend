// src/routes/auth.routes.js
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getCurrentUser, getUserProfile, login, register, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUserProfile);
router.post('/reset-password', resetPassword);


export default router;
