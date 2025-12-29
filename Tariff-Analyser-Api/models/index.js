'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const config = require(__dirname + '/../config/config.json')[process.env.NODE_ENV || 'development'];

// Override config with .env if present
if (process.env.DB_NAME) config.database = process.env.DB_NAME;
if (process.env.DB_USER) config.username = process.env.DB_USER;
if (process.env.DB_PASS) config.password = process.env.DB_PASS;
if (process.env.DB_HOST) config.host = process.env.DB_HOST;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import merged models
const models = require('./impact_analysis.models');

const db = {};
for (const modelName in models) {
  db[modelName] = models[modelName](sequelize, Sequelize.DataTypes);
}

// Initialize associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;