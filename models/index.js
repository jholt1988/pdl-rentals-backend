import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import configJson from '../config/config.json' with { type: 'json' };


const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const initDb = async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter(file => {
        const isHiddenFile = file.indexOf('.') === 0;
        const isCurrentFile = file === basename;
        const isJavaScriptFile = file.endsWith('.js');
        const isTestFile = file.endsWith('.test.js');
        return !isHiddenFile && !isCurrentFile && isJavaScriptFile && !isTestFile;
    });

  files.forEach(file => {
    const modelModule = require(path.join(__dirname, file)).default;
    const model = modelModule(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
}

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;

await initDb();

export default db;

