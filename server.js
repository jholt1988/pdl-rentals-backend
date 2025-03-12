// Updated server.js with PostgreSQL (Sequelize), Integrated Controllers, Full CRUD Operations, Authentication with RBAC, Password Reset & Refresh Tokens
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize } = require("./models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { User, Property, Lease, Payment, Maintenance } = require("./models");
const nodemailer = require("nodemailer");
const runJobs = require('./jobs')

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

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

// Import Routes
const leaseRoutes = require("./routes/leaseRoutes");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");



// Use Routes with authentication
app.use("/api/leases", authenticateToken, leaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", authenticateToken, propertyRoutes);
app.use("/api/users", authenticateToken, authorizeRole(["admin"]), userRoutes);
app.use("/api/payments", authenticateToken, paymentRoutes);
app.use("/api/maintenance", authenticateToken, maintenanceRoutes);

const PORT = process.env.PORT || 5000;

// Sync models and start server
runJobs()
sequelize.sync({ force: false }).then(() => {
    console.log("Database synchronized successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error("Database connection error:", err);
});

// Generate Sequelize models & migrations
const { execSync } = require("child_process");
const generateModels = [
    "npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string",
    "npx sequelize-cli model:generate --name Property --attributes name:string,address:string,ownerId:integer",
    "npx sequelize-cli model:generate --name Lease --attributes propertyId:integer,tenantId:integer,rentAmount:decimal,startDate:date,endDate:date,status:string",
    "npx sequelize-cli model:generate --name Payment --attributes leaseId:integer,amount:decimal,paymentDate:date,status:string",
    "npx sequelize-cli model:generate --name Maintenance --attributes propertyId:integer,description:string,status:string,requestDate:date"
];

console.log("Generating Sequelize models and migrations...");
generateModels.forEach(cmd => execSync(cmd, { stdio: 'inherit' }));

console.log("All Sequelize models and migrations have been generated.");
