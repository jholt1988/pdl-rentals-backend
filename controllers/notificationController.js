// src/controllers/notification.controller.js
import db from '../models/index.js';

const { Notification } = db;
export const createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        const io = req.app.get('io');
        io.emit('notification:new', notification);
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

export const updateNotification = async (req, res) => {
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
};

export const deleteNotification = async (req, res) => {
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
};
