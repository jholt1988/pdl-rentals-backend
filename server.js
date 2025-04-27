// Updated server.js with PostgreSQL (Sequelize), Integrated Controllers, Full CRUD Operations, Authentication with RBAC, Password Reset & Refresh Tokens
import dotenv from 'dotenv';
dotenv.config();
import express from"express";
import cors from"cors";
import helmet from"helmet";
import morgan from "morgan";
import { sequelize } from"./models/index.js";

import jwt from"jsonwebtoken";

import crypto from"crypto";
import runJobs from './jobs/index.js'

// Import Routes
import leaseRoutes from "./routes/leaseRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";  
import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import { io } from "./server/socketServer.js"; // Import socket.io instance
// Import reports routes
// import { sendEmail } from './utils/email.js';

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
app.use(morgan("common"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors("*"))


// app.options(function (req, res, next) {
//     const allowedOrigins = ["https://pdl-rentals-frontend.vercel.app"];
//     const origin = req.headers.origin;

//     if (allowedOrigins.indexOf(origin) != -1) {
//         res.header("Access-Control-Allow-Origin", origin);
//     } else {
//         res.header("Access-Control-Allow-Origin", "*");
//     }
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin,Content-Type,Authorization,Accept,X-Requested-With,Cookie,User-Agent,Host,Referer"
//     );
//     res.header("Access-Control-Expose-Headers", "Content-Disposition");
//     if ("OPTIONS" == req.method) {
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });
// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
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



app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


// Use Routes with authentication
app.use("/api/leases", leaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", io, notificationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/tenants", tenantRoutes);
// app.use("/api/

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
export default app;