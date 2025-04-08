
// Import required modules
import 'dotenv/config';
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
import Notification from './notification.js';


// Initialize database object
const db = {};
;
// Configure database connection
const sequelize = new Sequelize(
  {
    database: "property_management",
    username: "postgres",
    password: "postgres",
    host: "18.218.213.59",
    port: 5434,
    dialect: "postgres",
  },
  
);

// Load models
const models = [Contractor, Property, User, MaintenanceRequest, Payment, Notification,Lease, Tenant, LedgerEntry, Expense];
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
