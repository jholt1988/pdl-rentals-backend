// Updated server.js with PostgreSQL (Sequelize), Integrated Controllers, Full CRUD Operations, Authentication with RBAC, Password Reset & Refresh Tokens
import dotenv from 'dotenv';
dotenv.config();
import express from"express";
import cors from"cors";
import helmet from"helmet";
import morgan from"morgan";
import { sequelize } from"./models/index.js";

import jwt from"jsonwebtoken";
;
import crypto from"crypto";
import runJobs from './jobs/index.js'

// Import Routes
import leaseRoutes from "./routes/leaseRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const frontendRegex= new RegExp('https://pdl-rentals-frontend[a-zA-Z0-9]*\.vercel\.app');

const whitelist = [
    
    "https://pdl-rentals-frontend.vercel.app",
]

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}// Corrected code: Set only one allowed origin.


const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
    // Remove the following line: res.setHeader('Access-Control-Allow-Origin', '*');
    // Add this one instead:
    res.setHeader('Access-Control-Allow-Origin', 'https://pdl-rentals-frontend.vercel.app'); // Allow only this origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", "", process.env.JWT_SECRET));
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Role-based access control (RBAC)
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access forbidden" });
        }
        next();
    };
};





// Use Routes with authentication
app.use("/api/leases", authenticateToken, leaseRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/properties", authenticateToken, propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", authenticateToken, paymentRoutes);
app.use("/api/maintenance", authenticateToken, maintenanceRoutes);
app.use("/api/admin", authenticateToken, adminRoutes);

const PORT = process.env.PORT || 5000;

// Sync models and start server
runJobs();
sequelize.sync({ force: false }).then(() => {
    console.log("Database synchronized successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error("Database connection error:", err);
});

// Generate Sequelize models & migrations
// import { execSync } from "child_process";
// const generateModels = [
//     "npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string",
//     "npx sequelize-cli model:generate --name Property --attributes name:string,address:string,ownerId:integer",
//     "npx sequelize-cli model:generate --name Lease --attributes propertyId:integer,tenantId:integer,rentAmount:decimal,startDate:date,endDate:date,status:string",
//     "npx sequelize-cli model:generate --name Payment --attributes leaseId:integer,amount:decimal,paymentDate:date,status:string",
//     "npx sequelize-cli model:generate --name Maintenance --attributes propertyId:integer,description:string,status:string,requestDate:date"
// ];

// console.log("Generating Sequelize models and migrations...");
// generateModels.forEach(cmd => execSync(cmd, { stdio: 'inherit' }));

// console.log("All Sequelize models and migrations have been generated.");
