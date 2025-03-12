import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate the user using JWT.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token Expired' });
        } else if (err.name === 'JsonWebTokenError') {
            res.status(400).json({ message: 'Invalid Token' });
        } else {
            res.status(400).json({ message: 'Invalid Token' });
        }
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Forbidden" });
        }
        next();
    };
};

export { authMiddleware, roleMiddleware };
