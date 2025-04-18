// src/routes/auth.routes.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import authController from '../controllers/authController.js';

const { register, login, getCurrentUser, getUserProfile, resetPassword } = authController;

const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);
router.post('/register', register);
router.post('/login', login);
// router.get('/me', authMiddleware, getUserProfile);
router.post('/reset-password', resetPassword);


export default router;
