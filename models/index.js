
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
import 'dotenv/config';

// Initialize database object
const db = {};
console.log(process.env)
console.log(process.env.DATABASE_URL);
// Configure database connection
const sequelize = new Sequelize(process.env.DATABASE_URL,{dialect: 'postgres'});

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
