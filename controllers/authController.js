import { DefaultTransporter } from 'google-auth-library';
import db from '../models/index.js';
import { hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const User = db.User;
const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
           
              await User.create({ name, email, password, role });
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = await req.body;
console.log(email,password)
            const user = await User.findOne({ where: { email } });
            console.log(user)
            if (!user) return res.status(400).json({ error: "Invalid credentials" });

            const isMatch = await compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

            const accessToken = jwt.sign({ id: user.id, role: user.role }, "abc123", { expiresIn: "1h" });
            const refreshToken = jwt.sign({ id: user.id }, "abc123", { expiresIn: "7d" });
            // res.status(200).json({ accessToken, refreshToken, user })
        res.send({ accessToken, refreshToken, user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    refreshToken: (req, res) => {
        const { token } = req.body;
        if (!token) return res.status(401).json({ error: "Access denied" });

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid refresh token" });

            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ accessToken });
        });
    },
    requestPasswordReset: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ error: "User not found" });

            const resetToken = crypto.randomBytes(32).toString("hex");
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Password Reset Request",
                text: `Use this token to reset your password: ${resetToken}`
            };

            await transporter.sendMail(mailOptions);
            res.json({ message: "Password reset email sent" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const user = await User.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } } });
            if (!user) return res.status(400).json({ error: "Invalid or expired token" });

            user.password = await hash(newPassword, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            res.json({ message: "Password reset successful" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // src/controllers/auth.controller.js
 getCurrentUser : async(req, res) => {
        res.json({
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            name: req.user.name || 'User'
        });
    }
};

export default authController