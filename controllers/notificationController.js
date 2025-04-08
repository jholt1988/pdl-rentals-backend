import db from "../models/index.js";
const { Notification } = db;

const notificationController = {
    getAllNotifications: async (req, res) => {
        try {
            const notifications = await Notification.findAll();
            res.json(notifications);
        } catch (err) {
            res.status(500).json({ error: 'Could not fetch notifications' });
        }
    },

    createNotification: async (req, res) => {
        const { userId, type, message } = req.body;
        try {
            const notification = await Notification.create({ userId, type, message });
            res.status(201).json(notification);
        } catch (err) {
            res.status(500).json({ error: 'Could not create notification' });
        }
    },

    getForUser: async (req, res) => {
        const { id: userId } = req.params;
        const notifications = await Notification.findAll({ where: { userId } });
        res.json(notifications);
    },

    markAsRead: async (req, res) => {
        const { id } = req.params;
        await Notification.update({ isRead: true }, { where: { id } });
        res.sendStatus(204);
    }
};

export default notificationController;