
import express from 'express';
const router = express.Router();
import notificationController from "../controllers/notificationController.js";
const {createNotification, getForUser, markAsRead} = notificationController;
// Create a notification
router.post('/', createNotification);

// Get all for a user
router.get('/user/:id', getForUser);

// Mark one as read
router.put('/:id/read', markAsRead);

export default router;
