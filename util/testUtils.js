import db from "../models/index.js";
import { faker, } from "@faker-js/faker";

const createProperty = () => {
    const address = faker.location.streetAddress();
    return {
        name: address.split(" ")[1],
        address: address,
        unitCount: faker.number.int({ min: 1, max: 10 }),
        landlordId: faker.number.int({ min: 1, max: 10 }),
    }
}

const createProperties = (count) => {
    const properties = [];
    for (let i = 0; i < count; i++) {
        properties.push(createProperty());
    }
    return properties;
}

const newProperties = createProperties(10);

const saveProperties = async () => {
    const savedProperties = [];
    for (let i = 0; i < newProperties.length; i++) {
        const property = newProperties[i];
        const savedProperty = await db.Property.create(property);
        savedProperties.push(savedProperty);
    }
    return savedProperties;
}

const createTenant = () => {
    return {
        name: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        propertyId: faker.number.int({ min: 1, max: 10 })
    }
}

const createTenants = (count) => {
    const tenants = [];
    for (let i = 0; i < count; i++) {
        tenants.push(createTenant());
    }
    return tenants;
}

const newTenants = createTenants(10);
const saveTenants = async () => {
    const savedTenants = [];
    for (let i = 0; i < newTenants.length; i++) {
        const tenant = newTenants[i];
        const savedTenant = await db.Tenant.create(tenant);
        savedTenants.push(savedTenant);
    }
    return savedTenants;
}

const createLease = () => {
    return {
        tenantId: faker.number.int({ min: 1, max: 10 }),
        propertyId: faker.number.int({ min: 1, max: 10 }),
        rentAmount: faker.number.int({ min: 1000, max: 3000 }),
        startDate: faker.date.past(),
        endDate: faker.date.future()
    }
}

const createLeases = (count) => {
    const leases = [];
    for (let i = 0; i < count; i++) {
        leases.push(createLease());
    }
    return leases;
}

const newLeases = createLeases(10);
const saveLeases = async () => {
    const savedLeases = [];
    for (let i = 0; i < newLeases.length; i++) {
        const lease = newLeases[i];
        const savedLease = await db.Lease.create(lease);
        savedLeases.push(savedLease);
    }
    return savedLeases;
}
const Payerlease = db.Lease.findAll()
    .then((leases) => {
        return leases[Math.floor(Math.random() * leases.length)];
    });

const createPayment = (lease) => {
  
    return {
        leaseId: lease.id,
        amount: lease.rentAmount,
        date: faker.date.past(),
        method: faker.helpers.arrayElement(["Cash", "Credit Card", "Debit Card", "Check"]),
        recieptUrl: faker.image.url()
    }
}

const createLeasePayments = (count) => {
    const leasePayments = [];   for (let i = 0; i < count; i++) {
        leasePayments.push(createPayment(Payerlease));
    }
    return leasePayments;
}

const createPayments = (count) => {
    const payments = [];
    for (let i = 0; i < count; i++) {
        payments.push(createLeasePayments(10));
    }
    return payments;
}

const allPayments = createPayments(10);

const savePayments = async () => {
    const savedPayments = [];
    for (let i = 0; i < allPayments.length; i++) {
        const leasePayments = allPayments[i];
        for (let j = 0; j < leasePayments.length; j++) {
            const payment = leasePayments[j];
            const savedPayment = await db.Payment.create(payment);
            savedPayments.push(savedPayment);
        }
    }
    return savedPayments;
}

const getTenant = await db.Tenant.findAll()    
    
const tenant = getTenant
console.log("tenant", tenant);

const createMaintenanceRequest = () => {
    
    return {
        tenantId: tenant.id,
        propertyId: tenant.propertyId,
        contractorId: faker.number.int({ min: 1, max: 10 }),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["Open", "In Progress", "Closed"]),
        date: faker.date.past(),
    };
}

const createMaintenanceRequests = (count) => {
    const maintenanceRequests = [];
    for (let i = 0; i < count; i++) {
        maintenanceRequests.push(createMaintenanceRequest(tenant));
    }
    return maintenanceRequests;
}

const allMaintenanceRequests = createMaintenanceRequests(10);

const saveMaintenanceRequests = async () => {
    const savedMaintenanceRequests = [];
    for (let i = 0; i < allMaintenanceRequests.length; i++) {
        const maintenanceRequest = allMaintenanceRequests[i];
        const savedMaintenanceRequest = await db.MaintenanceRequest.create(maintenanceRequest);
        savedMaintenanceRequests.push(savedMaintenanceRequest);
    }
    return savedMaintenanceRequests;
}

const createTenantLedgerEntries = () => {
    const ledgerEntries = [];
    const tenant = faker.helpers.arrayElement(tenants);
    const lease = db.Lease.findOne({ where: { tenantId: tenant.id } });
    const payments = db.Payment.findAll({ where: { leaseId: lease.id } });
    const rentCount = faker.number.int({ min: 1, max: 12 });   
    const paymentCount = payments.length;
    const lateFeeCount = faker.number.int({ min: 0, max: 3 });
    const miscFeeCount = faker.number.int({ min: 0, max: 3 });
    
    for (let i = 0; i < rentCount; i++) {
        ledgerEntries.push({
            tenantId: tenant.id,
            leaseId: lease.id,
            type: "charge",
            amount: lease.rentAmount,
            description: "Rent",
            date: faker.date.past(),
        });
    }
    
    for (let i = 0; i < paymentCount; i++) {
        ledgerEntries.push({
            tenantId: tenant.id,
            leaseId: lease.id,
            type: "payment",
            amount: payments[i].amount,
            description: "Payment",
            date: payments[i].date,
        });
    }
    
    for (let i = 0; i < lateFeeCount; i++) {
        ledgerEntries.push({
            tenantId: tenant.id,
            leaseId: lease.id,
            type: "charge",
            amount: 35,
            description: "Late Fee",
            date: faker.date.past(),
        });
    }
    
    for (let i = 0; i < miscFeeCount; i++) {
        ledgerEntries.push({
            tenantId: tenant.id,
            leaseId: lease.id,
            type: "charge",
            amount: faker.number.int({ min: 100, max: 500 }),
            description: faker.helpers.arrayElement([
                "Repair-Tenant Responsibility",
                "Utility Bill", 
                "Misc Fees",
            ]),
            date: faker.date.past(),
        });
    }
    return ledgerEntries;
}

const createLedgerEntries = () => {
    const ledgerEntries = [];
    for (let i = 0; i < tenants.length - 1; i++) {
        ledgerEntries.push(createTenantLedgerEntries());
    }
    return ledgerEntries;
}

const saveLedgerEntries = async () => {
    const savedLedgerEntries = [];
    for (let i = 0; i < createLedgerEntries().length; i++) {
        const ledgerEntry = createLedgerEntries()[i];
        for (let j = 0; j < ledgerEntry.length; j++) {
            const entry = ledgerEntry[j];
            const savedLedgerEntry = await db.LedgerEntry.create(entry);
            savedLedgerEntries.push(savedLedgerEntry);
        }
    }
    return savedLedgerEntries;
}

const seedDatabase = async () => {
    try {
        await saveProperties();
        await saveTenants();
        await saveLeases();
        await saveMaintenanceRequests();
        await savePayments();
        await saveLedgerEntries();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

export { seedDatabase } 

