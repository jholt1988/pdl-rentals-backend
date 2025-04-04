
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


// Initialize database object
const db = {};
;
// Configure database connection
const sequelize = new Sequelize(
  {
    database: "pdl_db",
    username: "postgres",
    password: "Admin2284JAH",
    host: "pdl-db-1.cl8ii8es83sc.us-east-2.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
  },
  
);

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
