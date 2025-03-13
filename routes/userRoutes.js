import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();
const { getUserProfile } = userController;
const { register, login, resetPassword} = authController;

router.post('/register', register);
router.post('/login',login );
router.get('/me', authMiddleware, getUserProfile);
router.post('/reset-password', resetPassword);

export default router;
