// src/utils/emitActivity.js
export const emitActivity = (req, message) => {
    const io = req.app.get('io');
    if (io) {
        io.emit('activity:new', {
            message,
            timestamp: new Date().toISOString()
        });
    }
};
