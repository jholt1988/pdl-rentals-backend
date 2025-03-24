// Import required modules
import { Sequelize } from 'sequelize';
import Contractor from './contractor.mjs';
import Property from './property.js';
import User from './user.js';
import MaintenanceRequest from './maintenancerequest.js';
import Payment from './payment.js';
import Lease from './lease.js';
import Tenant from './tenant.js';
import LedgerEntry from './ledgerEntry.js';
import Expense from './expense.js';

// Initialize database object
const db = {};

// Configure database connection
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "3.136.156.79", 
  port: 5432,
  username: "postgres",
  password: "2284",
  database: "PDL_development",
 logging:(msg)=>console.log(msg)
});

// Load models
const models = [Contractor, Property, User, MaintenanceRequest, Payment, Lease, Tenant, LedgerEntry, Expense];
models.forEach(model => {
  const initializedModel = model(sequelize, Sequelize.DataTypes);
  db[initializedModel.name] = initializedModel;
});

// Set up model associations
function setupAssociations() {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

// Initialize
setupAssociations();

export { sequelize };
export default db;
