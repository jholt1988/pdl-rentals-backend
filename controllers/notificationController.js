// src/controllers/notification.controller.js
import e from 'express';
import db from '../models/index.js';

const { Notification } = db;

const notificationController = {
    createNotification: async (req, res) => {
        try {
            const notification = await Notification.create(req.body);
            const io = req.app.get('io');
            io.emit('notification:new', notification);
            res.status(201).json(notification);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create notification' });
        }
    },
    getForUser: async (req, res) => {
        try {
            const notifications = await Notification.findAll({
                where: { userId: req.params.id },
                order: [['createdAt', 'DESC']]
            });
            res.json(notifications);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    },

    markAsRead: async (req, res) => {
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) return res.status(404).json({ error: 'Not found' });

            await notification.update({ read: true });
            const io = req.app.get('io');
            io.emit('notification:update', notification);
            res.json(notification);
        } catch (err) {
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    },

    updateNotification: async (req, res) => {
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) return res.status(404).json({ error: 'Not found' });

            await notification.update(req.body);
            const io = req.app.get('io');
            io.emit('notification:update', notification);
            res.json(notification);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update notification' });
        }
    },

    deleteNotification: async (req, res) => {
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) return res.status(404).json({ error: 'Not found' });

            await notification.destroy();
            const io = req.app.get('io');
            io.emit('notification:delete', notification.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete notification' });
        }
    }
};

export default notificationController;
