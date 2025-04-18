import db,{sequelize} from "../models/index.js";
import { faker, } from "@faker-js/faker";
import tenant from "../models/tenant.js";
import { Transaction } from "sequelize";
import property from "../models/property.js";



const CONFIG = {
    BATCH_SIZE: 1000,
    MIN_ENTRIES: 1,
    MAX_ENTRIES: 12,
    DEFAULT_LATE_FEE: 35.00,
    MIN_RENT: 1000,
    MAX_RENT: 3000
};

const memoizedFetch = async (model) => {
    
    if (!memoizedFetch[model.name]) {
    
        memoizedFetch[model.name] = await db[model.name].findAll({limit:1000});
    }

    return memoizedFetch[model.name];
};

const createProperty = () => { 
    const address = faker.location.streetAddress();
        return {
            name: address.split(" ")[1],
            address: address,
            units: faker.number.int({ min: 1, max: 10 }),
            landlordId: faker.number.int({ min: 1, max: 10 }),
        }
    }


const newProperties = Array.from({ length: CONFIG.BATCH_SIZE }, createProperty);
let savedPropertiesArr = [];
const saveProperties = async () => {
    const savedProperties = await db.Property.bulkCreate(newProperties, {
        returning: true
    });
    console.log("saved properties", savedProperties);
    savedPropertiesArr = savedProperties 
    return savedProperties;
};

const createTenant = () => {

   
    
    
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    propertyId: faker.number.int({min: 1, max: 1000}),
    
  };
};

const newTenants = Array.from({ length: CONFIG.BATCH_SIZE },createTenant)
let tenantsArr
const saveTenants = async () => {
    const tenantsWithUsers = newTenants.map(tenant => ({
        tenant: {
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
        },
        user: {
            name: tenant.name,
            email: tenant.email,
            password: faker.internet.password(),
            role: "tenant"
        }
    }));
      
    const savedRecords = await sequelize.transaction(async (transaction) => {
        const savedTenants = await db.Tenant.bulkCreate(
            tenantsWithUsers.map(t => t.tenant),
            { transaction }
        );
        const savedUsers = await db.User.bulkCreate(
            tenantsWithUsers.map(t => t.user),
            { transaction }
        );
        return { savedTenants, savedUsers };
    });
    tenantsArr = savedRecords.savedTenants;
    return savedRecords.savedTenants;
};

let tenants = await memoizedFetch(db.Tenant);
let properties = await memoizedFetch(db.Property);

const validateLeaseData = (lease) => {
    if (!lease.propertyId || !lease.tenantId) {
        throw new Error('Missing required property or tenant ID');
    }
    if (lease.startDate >= lease.endDate) {
        throw new Error('Lease end date must be after start date');
    }
    if (lease.rentAmount <= 0) {
        throw new Error('Rent amount must be greater than 0');
    }
    return lease;
};

const createLease = () => {
    if (!tenants.length || !properties.length) {
        throw new Error('No available tenants or properties for lease creation');
    }

    const startDate = faker.date.future();
    const lease = validateLeaseData({
        startDate,
        endDate: faker.date.future({ refDate: startDate }),
        rentAmount: faker.finance.amount({
            min: CONFIG.MIN_RENT,
            max: CONFIG.MAX_RENT,
            dec: 2
        }),
        status: faker.helpers.arrayElement([
            "pending",
            "approved",
            "active",
            "terminated"
        ]),
        propertyId: properties[0].id,
        tenantId: tenants[0].id
    });

    tenants = tenants.slice(1);
    properties = properties.slice(1);

    return lease;
};


const newLeases = Array.from({ length: CONFIG.BATCH_SIZE }, createLease)

const saveLeases = async () => { 
    const savedLeases = await db.Lease.bulkCreate(newLeases, {
        returning: true
    });
    console.log("saved leases", savedLeases);
    return savedLeases;

}

const createPayments = async () => { 
    const leases = await db.Lease.findAll();


    const payments = leases.map(lease => {
        const payment = {
            leaseId: lease.id,
            amount: faker.number.int({ min: CONFIG.MIN_RENT, max: CONFIG.MAX_RENT }),
            paymentDate: faker.date.future(),
            paymentType: 'cash',
            tenantId: lease.tenantId
};
        return payment;
    });

    return payments;
};
const allPayments = await createPayments();

const savePayments = async () => {
    const flattenedPayments = allPayments.flat();
    const savedPayments = await db.Payment.bulkCreate(flattenedPayments);
    console.log("saved payments", savedPayments);
    return savedPayments;
};

const createMaitenanceRequests = async () => { 

    const tenants = await db.Tenant.findAll();

    const maintenanceRequests = tenants.map(tenant => {
        const maintenanceRequest = {
            propertyId: tenant.propertyId,
            description: faker.lorem.sentence(),
            status: 'pending',
            date: faker.date.future(),
        };
        return maintenanceRequest;
    });

    return maintenanceRequests;

}


const newMaintenanceRequests = await createMaitenanceRequests();

const saveMaintenanceRequests = async () => {
    const savedMaintenanceRequests = await db.MaintenanceRequest.bulkCreate(newMaintenanceRequests);
    console.log("saved maintenance requests", savedMaintenanceRequests);
    return savedMaintenanceRequests;
};

const generateRentChargeEntry = (lease, tenant) => {
    console.log(lease.rentAmount)
    return {
      tenantId: tenant.id,
      type: "charge",
      debit: parseFloat(lease.rentAmount),

      description: "Rent",
      date: faker.date.past(),
      createdBy: "Admin",
    };

};
const generateRentPaymentEntry = (lease, tenant,payment) => {
    return {
      tenantId: tenant.id,
      type: "payment",
      credit: parseFloat(payment.amount),

      description: "Rent Payment" + " " + payment.method + " " + payment.id,
      // description: "Rent Payment",
      date: payment.date,
      createdBy: "Admin",
    };
};

const generateLateFeeEntry = (lease, tenant) => {
    return {
        tenantId: tenant.id,
        type: "charge",
        debit: CONFIG.MIN_ENTRIES,
        description: "Late Fee",
        date: faker.date.past(),
        createdBy: "Admin",
    };
}
const generateMiscChargeEntry = (lease, tenant) => {
    return {
        tenantId: tenant.id,
        type: "charge",
        debit: faker.number.int({ min: 100, max: 500 }),
        description: faker.helpers.arrayElement([
            "Repair-Tenant Responsibility",
            "Utility Bill",
            "Misc Fees",
        ]),
        date: faker.date.past(),
        createdBy: "Admin",
    };
}

const generateLedgerEntry = async (type, tenant, lease,payment) => {
  switch (type) {
    case "rent_charge":
      return generateRentChargeEntry(tenant, lease);
    case "rent_payment":
      return generateRentPaymentEntry(tenant, lease, payment);
    case "late_fee":
      return generateLateFeeEntry(tenant, lease);
    case "misc_charge":
      return generateMiscChargeEntry(tenant, lease);
    default:
      throw new Error(`Invalid ledger entry type: ${type}`);
  }
};



const createTenantLedgerEntries = async () => {
    const tenants = await db.Tenant.findAll();

    const ledgerTypes = ['rent_charge', 'late_fee', 'misc_charge'];
    const ledgerEntries = [];

    for (const tenant of tenants) {
        const lease = tenant.Lease;
        if (!lease) continue;

        for (const type of ledgerTypes) {
            const entryCount = getRandomInt(1, 12);
            for (let i = 0; i < entryCount; i++) {
                const entry = await generateLedgerEntry(type, tenant.dataValues, lease.dataValues);
                ledgerEntries.push(entry);
            }
        }
    }

    return await db.LedgerEntry.bulkCreate(ledgerEntries);
};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createBatchedRecords = async (model, records, batchSize = 1000) => {
    const results = [];
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const savedBatch = await model.bulkCreate(batch);
        results.push(...savedBatch);
    }
    return results;
};

const createLedgerEntryPayment = async (tenant, lease, payment) => {
    const entry = {
        tenantId: tenant.id,
        leaseId: lease.id,
        amount: payment.amount,
        date: payment.date,
        type: 'rent_payment',
        description: 'Payment for rent',
    };
    return entry;
};

const createTenantLedgerEntryPayments = async () => {
    const tenants = await db.Tenant.findAll();

    const ledgerEntries = [];

    for (const tenant of tenants) {
        const lease = tenant.Lease;
        if (!lease) continue;

        const payments = await db.Payment.findAll({
            where: {
                tenantId: tenant.id
            }
        });

        for (const payment of payments) {
            const entry = await createLedgerEntryPayment(tenant, lease, payment);
            ledgerEntries.push(entry);
        }
    }

    return await db.LedgerEntry.bulkCreate(ledgerEntries);
};



// const createProperty = () => {
//     const address = faker.location.streetAddress();
//     return {
//         name: address.split(" ")[1],
//         address: address,
//         units: faker.number.int({ min: 1, max: 10 }),
//         landlordId: faker.number.int({ min: 1, max: 10 }),
//     }
// }

// const createProperties = (count) => {
//     const properties = [];
//     for (let i = 0; i < count; i++) {
//         properties.push(createProperty());
//     }
//     return properties;
// }

// const newProperties = createProperties(10);

// const saveProperties = async () => {
//     const transaction = await sequelize.transaction();
//     const savedProperties = [];
//     for (let i = 0; i < newProperties.length; i++) {
//         const property = newProperties[i];
//         const savedProperty = await db.Property.create(property, { transaction });
//         savedProperties.push(savedProperty);
    
//     }
//     await transaction.commit();
//     console.log("saved properties", savedProperties);
//     return savedProperties;
//  }

//     const createTenant = () => {
//         return {
//             name: faker.person.firstName() + " " + faker.person.lastName(),
//             email: faker.internet.email(),
//             phone: faker.phone.number(),
       
//         }
//     }

// const createTenants = (count) => {
//     const tenants = [];
//     for (let i = 0; i < count; i++) {
//         tenants.push(createTenant());
//     }
//     return tenants;
// }

// const newTenants = createTenants(10);
// const saveTenants = async () => {
//     const transaction = await sequelize.transaction();
//     const savedTenants = [];
   
//     for (let i = 0; i < newTenants.length; i++) {
//         const tenant = newTenants[i];
       
       
//         const savedTenant = await db.Tenant.create(tenant, { transaction });
//         const savedUser= await db.User.create({
//             name: savedTenant.name,
//             email: savedTenant.email,
//             password: faker.internet.password(),
//             role: "tenant",
//         }, { transaction });
     
//         savedTenants.push(savedTenant);
   
//     }
//     await transaction.commit();
//     console.log("saved tenants", savedTenants);
//     return savedTenants;
// }
// // const createUser =async () => {
// //     const transaction = await sequelize.transaction();
// //     const users = [];
// //     for (const tenant of tenants) {
        

// //         const user = await , { transaction });
// //         await tenant.update({ userId: user.id }, { transaction });
// //         users.push(user);
// //     }
// //     await transaction.commit();
// //     console.log("saved users", users);
// // }


  

// const tenants = await db.Tenant.findAll()
//     .then((tenants) => {
//         return tenants;
//     });
// const properties = await db.Property.findAll()
//     .then((properties) => {
//         return properties;
//     });
// const createLease = async () => {
   

//     const tenantIndex = getRandomInt(0, tenants.length - 1);
//     const propertyIndex = getRandomInt(0, properties.length - 1);
//     const tenant = tenants[tenantIndex].dataValues;
//     tenants.splice(tenantIndex, 1)
//     const property = properties[propertyIndex].dataValues;
//     properties.splice(propertyIndex, 1)
//         ;
//     return {
//         tenantId: tenant.id,
//         propertyId: property.id,
//         rentAmount: faker.number.float({ min: 1000, max: 3000 }),
//         startDate: faker.date.past(),
//         endDate: faker.date.future(),
//     };
// }
// // }

// // const createLeases = async(count) => {
// //     const leases = [];
// //     for (let i = 0; i < count; i++) {
// //         leases.push(await createLease());
// //     }
// //     return leases;
// // }

// // const newLeases = await createLeases(10); 
// // const saveLeases = async () => {

// //     const transaction = await sequelize.transaction();
    
// //     const savedLeases = [];
// //     for (let i = 0; i < newLeases.length-1; i++) {
// //         const lease = newLeases[i];
// //         const savedLease = await db.Lease.create(lease, { transaction });
// //         const tenant = await db.Tenant.findByPk(lease.tenantId, { transaction });
// //         await tenant.update({ leaseId: savedLease.id, propertyId: savedLease.propertyId }, { transaction });
// //         savedLeases.push(savedLease);
// //     }
// //     await transaction.commit();
// //     console.log("saved leases", savedLeases);
// //     return savedLeases;
// // }    
// let leaseArr
// const leases = await db.Lease.findAll()
// console.log("leases", leases);
// const createPayment = () => {
   
//   const leaseIndex = getRandomInt(0, leases.length - 1 );
//     const Payerlease = leases[leaseIndex];
//     console.log("payerLease", Payerlease);
//     return {
//         leaseId:Payerlease.dataValues.id,
//         amount: Payerlease.dataValues.rentAmount,
//         date: faker.date.past(),
//         method: faker.helpers.arrayElement(["Cash", "Credit Card", "Debit Card", "Check"]),
//         recieptUrl: faker.image.url()
//     }
// }
// // // const updatePayments = async (leaseId) => { 
   

// // // const payments = await db.Payment.findAll();
  
// // // for (let i = 0; i < payments.length; i++) {
// // //     const lease = leases[Math.floor(Math.random() * leases.length)];
// // //         const payment = payments[i];
// // //         await payment.update({ amount: lease.rentAmount, leaseId: lease.id });
// // //     }


// const createLeasePayments = (count) => {
//     const leasePayments = [];   for (let i = 0; i < count; i++) {
//         leasePayments.push(createPayment());
//     }
//     return leasePayments;
// }

// const createPayments = (count) => {
//     const payments = [];
//     for (let i = 0; i < count; i++) {
//         payments.push(createLeasePayments(12));
//     }
//     return payments;
// }

// const allPayments = createPayments(10);

// const savePayments = async () => {
//     const transaction = await sequelize.transaction();
//     const savedPayments = [];
//     for (let i = 0; i < allPayments.length; i++) {
//         const leasePayments = allPayments[i];
//         for (let j = 0; j < leasePayments.length; j++) {
//             const payment = leasePayments[j];
//             const savedPayment = await db.Payment.create(payment, { transaction });
//             savedPayments.push(savedPayment);
//         }
//     }
//     await transaction.commit();
//     console.log("saved payments", savedPayments);
//     return savedPayments;
// }


// const createMaintenanceRequest = async() => {

//    const tenants = await db.Tenant.findAll();
//    const tenant = tenants[getRandomInt(0, tenants.length - 1)].dataValues;
     
//     return {
//         tenantId: tenant.id,
//         propertyId: tenant.propertyId,
//         title: faker.lorem.sentence(),
//         contractorId: faker.number.int({ min: 1, max: 10 }),
//         description: faker.lorem.sentence(),
//         status: faker.helpers.arrayElement(["Open", "In Progress", "Closed"]),
//         date: faker.date.past(),
//     };
// }

// const createMaintenanceRequests = (count) => {
//     const maintenanceRequests = [];
//     for (let i = 0; i < count; i++) {
//         maintenanceRequests.push(createMaintenanceRequest());
//     }
//     return maintenanceRequests;
// }

// const allMaintenanceRequests = createMaintenanceRequests(10);

// const saveMaintenanceRequests = async () => {
//     const savedMaintenanceRequests = [];
//     for (let i = 0; i < allMaintenanceRequests.length - 1; i++) {
//         const maintenanceRequest = allMaintenanceRequests[i];
//         const savedMaintenanceRequest = await db.MaintenanceRequest.create(maintenanceRequest);
//         savedMaintenanceRequests.push(savedMaintenanceRequest);
//     }
//     return savedMaintenanceRequests;
// }

// const generateRentChargeEntry = (lease, tenant) => {
//     console.log(lease.rentAmount)
//     return {
//       tenantId: tenant.id,
//       type: "charge",
//       debit: parseFloat(lease.rentAmount),

//       description: "Rent",
//       date: faker.date.past(),
//       createdBy: "Admin",
//     };

// };
// const generateRentPaymentEntry = (lease, tenant,payment) => {
//     return {
//       tenantId: tenant.id,
//       type: "payment",
//       credit: parseFloat(payment.amount),

//       description: "Rent Payment" + " " + payment.method + " " + payment.id,
//       // description: "Rent Payment",
//       date: payment.date,
//       createdBy: "Admin",
//     };
// };

// const generateLateFeeEntry = (lease, tenant) => {
//     return {
//         tenantId: tenant.id,
//         type: "charge",
//         debit: 35.00,
//         description: "Late Fee",
//         date: faker.date.past(),
//         createdBy: "Admin",
//     };
// }
// const generateMiscChargeEntry = (lease, tenant) => {
//     return {
//         tenantId: tenant.id,
//         type: "charge",
//         debit: faker.number.int({ min: 100, max: 500 }),
//         description: faker.helpers.arrayElement([
//             "Repair-Tenant Responsibility",
//             "Utility Bill",
//             "Misc Fees",
//         ]),
//         date: faker.date.past(),
//         createdBy: "Admin",
//     };
// }   

// const generateLedgerEntry = async (type, tenant, lease,payment) => {
//   switch (type) {
//     case "rent_charge":
//       return generateRentChargeEntry(tenant, lease);
//     case "rent_payment":
//       return generateRentPaymentEntry(tenant, lease, payment);  
//     case "late_fee":
//       return generateLateFeeEntry(tenant, lease);
//     case "misc_charge":
//       return generateMiscChargeEntry(tenant, lease);
//     default:
//       throw new Error(`Invalid ledger entry type: ${type}`);
//   }
// };



 

// const createTenantLedgerEntries = async () => {
//     const tenants = await db.Tenant.findAll()
    
    

//     // Define ledger entry types
//     const ledgerTypes = ['rent_charge', 'late_fee', 'misc_charge'];

//     // Define the range for the number of entries per type
//     const minEntries = 1;
//     const maxEntries = 12;
 
//     for (const tenant of tenants) {
//         const lease = await db.Lease.findOne({ where: { tenantId: tenant.dataValues.id } }).then((lease) => {
//             return lease;
//         });
//         if (!lease) {
//             console.log("No lease found for tenant", tenant.dataValues.id);
//             continue;
//         }
       
//         for (const type of ledgerTypes) {
//                         const entryCount = getRandomInt(minEntries, maxEntries);
//             for (let i = 0; i < entryCount; i++) {
//                 const entry = await generateLedgerEntry(type, tenant.dataValues, lease.dataValues);
//                 await db.LedgerEntry.create(entry);
//             }
//         }
//     }
// }

// const createLedgerEntryPayment = async (tenant, lease) => {
//     const tenants = await db.Tenant.findAll()
//         .then((tenants) => {
//             return tenants;
//         });



//     // Define ledger entry types


//     for (const tenant of tenants) {
//         const lease = await db.Lease.findOne({ where: { tenantId: tenant.dataValues.id } })
//         if (!lease) {
//             console.log("No lease found for tenant", tenant.dataValues.id);
//             continue;
//         }
//         const payments = await db.Payment.findAll({ where: { leaseId: lease.dataValues.id } })
//             const entryCount = payments.length;
//             for (let i = 0; i < entryCount; i++) {
//               const entry = await generateLedgerEntry(
//                 "rent_payment",
//                 tenant.dataValues,
//                 lease.dataValues,
//                 payments[i].dataValues
//               );
//               await db.LedgerEntry.create(entry);
//             }
//         }
//     }
    
//     // Helper function to generate a random integer between min and max (inclusive)
  

    



// const createLedgerEntries = () => {
//     const ledgerEntries = [];
//     for (let i = 0; i < tenants.length - 1; i++) {
//         ledgerEntries.push(createTenantLedgerEntries());
//     }
//     return ledgerEntries;
// }



// // const maintenanceRequests = await db.MaintenanceRequest.findAll();
// // const updateMaintenanceRequests = async () => {
// //     for (let i = 0; i < maintenanceRequests.length; i++) {
// //         const maintenanceRequest = maintenanceRequests[i];
// //         const title = faker.lorem.sentence();
// //         const tenant = await db.Tenant.findByPk(maintenanceRequest.tenantId);
// //         await maintenanceRequest.update({ propertyId: tenant.propertyId , title: title});
// //     }
// //     return maintenanceRequests;
// // }
const handleDatabaseError = (error, operation) => {
    console.error(`Error during ${operation}:`, {
        message: error.message,
        stack: error.stack,
        operation
    });
    throw error;
};


const seedDatabase = async () => {
    console.log('Starting database seed');
    try {
        await sequelize.transaction(async (transaction) => {
            // const properties = await saveProperties(transaction);
            // const tenants = await saveTenants(transaction);

            // const leases = await createBatchedRecords(
            //   db.Lease,
            //   await saveLeases(),
            //   1000
            // );
            const payments = await savePayments(transaction);
            const maintenanceRequests = await saveMaintenanceRequests(transaction);
            const tenantPaymentLedgerEntries = await createBatchedRecords(
                db.LedgerEntry,
                await createTenantLedgerEntryPayments(),
                1000
            );


            
            // Create ledger entries in batches
            // await createBatchedRecords(
            //     db.LedgerEntry,
            //     await createTenantLedgerEntries(),
            //     1000
            // );
        });
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};


// const seedDatabase = async () => {
   
//     console.log('Database synced successfully');
//     try {
     
//     // await saveLeases(); 
//        await saveMaintenanceRequests();
//         //   await createTenantLedgerEntries()
//         //  await createLedgerEntryPayment();
//         console.log('Database seeded successfully');
//     } catch (error) {
//         console.error('Error seeding database:', error);
//     }
// }

export { seedDatabase } 

