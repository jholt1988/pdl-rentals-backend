// seed.js
const { sequelize, User, Tenant, Property, Lease, Payment, Expense, Contractor, MaintenanceRequest, LedgerEntry } = require("../models/");
const bcrypt = require("bcryptjs");

async function generateMockData() {
    try {
        // Drop and recreate all tables (development only)
        await sequelize.sync({ force: true });
        console.log("Database synchronized.");

        // Create Users: Admin, Tenant, Contractor
        const adminPassword = await bcrypt.hash("admin123", 10);
        const tenantPassword = await bcrypt.hash("tenant123", 10);
        const contractorPassword = await bcrypt.hash("contractor123", 10);

        const users = await User.bulkCreate([
            { name: "Admin User", email: "admin@example.com", password: adminPassword, role: "Admin" },
            { name: "John Tenant", email: "john@example.com", password: tenantPassword, role: "Tenant" },
            { name: "Jane Tenant", email: "jane@example.com", password: tenantPassword, role: "Tenant" },
            { name: "Mike Contractor", email: "mike@example.com", password: contractorPassword, role: "Contractor" }
        ]);
        console.log("Users created.");

        // Create Properties (landlord is the Admin)
        const properties = await Property.bulkCreate([
            { address: "123 Main St, City, State", units: 4, landlordId: users[0].id },
            { address: "456 Oak Ave, City, State", units: 2, landlordId: users[0].id }
        ]);
        console.log("Properties created.");

        // Create Tenants (associated with John and Jane)
        const tenants = await Tenant.bulkCreate([
            { userId: users[1].id, phone: "555-1234", leaseId: null, name: "John Tenant", email: "john@example.com" },
            { userId: users[2].id, phone: "555-5678", leaseId: null, name: "Jane Tenant", email: "jane@example.com" }
        ]);
        console.log("Tenants created.");

        // Create Leases: each tenant rents one property
        const today = new Date();
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        const leases = await Lease.bulkCreate([
            {
                propertyId: properties[0].id,
                tenantId: tenants[0].id,
                rentAmount: 1200,
                petDeposit: 200,
                deposit: 1200,
                utilities: ["water", "electric"],
                startDate: today,
                endDate: nextYear,
                documentUrl: ""
            },
            {
                propertyId: properties[1].id,
                tenantId: tenants[1].id,
                rentAmount: 900,
                petDeposit: 150,
                deposit: 900,
                utilities: ["gas"],
                startDate: today,
                endDate: nextYear,
                documentUrl: ""
            }
        ]);
        console.log("Leases created.");

        // Update tenants with lease IDs
        tenants[0].leaseId = leases[0].id;
        tenants[1].leaseId = leases[1].id;
        await Promise.all(tenants.map(tenant => tenant.save()));
        console.log("Tenants updated with lease IDs.");

        // Create Payments: each tenant makes an initial payment
        await Payment.bulkCreate([
            { leaseId: leases[0].id, amount: 1200, date: today, method: "Credit Card", receiptUrl: "" },
            { leaseId: leases[1].id, amount: 900, date: today, method: "Bank Transfer", receiptUrl: "" }
        ]);
        console.log("Payments created.");

        // Create Contractors
        const contractors = await Contractor.bulkCreate([
            { name: "Mike Contractor", phone: "555-9012", email: "mike@example.com", serviceType: "Plumbing" }
        ]);
        console.log("Contractors created.");

        // Create Expenses for properties
        await Expense.bulkCreate([
            { propertyId: properties[0].id, amount: 300, description: "Repair leak", date: today, contractorId: contractors[0].id },
            { propertyId: properties[1].id, amount: 150, description: "Fix HVAC", date: today, contractorId: contractors[0].id }
        ]);
        console.log("Expenses created.");

        // Create Maintenance Requests
        await MaintenanceRequest.bulkCreate([
            { propertyId: properties[0].id, tenantId: tenants[0].id, contractorId: contractors[0].id, status: "Pending", description: "Leaky faucet" },
            { propertyId: properties[1].id, tenantId: tenants[1].id, contractorId: contractors[0].id, status: "Completed", description: "Broken window" }
        ]);
        console.log("Maintenance requests created.");

        // Create Ledger Entries: monthly rent charges and corresponding payments
        await LedgerEntry.bulkCreate([
            { tenantId: tenants[0].id, leaseId: leases[0].id, type: "charge", amount: 1200, description: "Monthly Rent", date: today },
            { tenantId: tenants[0].id, leaseId: leases[0].id, type: "payment", amount: 1200, description: "Rent Payment", date: today },
            { tenantId: tenants[1].id, leaseId: leases[1].id, type: "charge", amount: 900, description: "Monthly Rent", date: today },
            { tenantId: tenants[1].id, leaseId: leases[1].id, type: "payment", amount: 900, description: "Rent Payment", date: today }
        ]);
        console.log("Ledger entries created.");

        console.log("Mock data generated successfully.");
        process.exit();
    } catch (error) {
        console.error("Error generating mock data:", error);
        process.exit(1);
    }
}

generateMockData();
// Run this script with node seed.js to generate mock data in the database.