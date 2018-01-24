const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(
  config.mysqlConfig.database,
  config.mysqlConfig.username,
  config.mysqlConfig.password,
  {
    dialect: 'mysql',
    host: config.mysqlConfig.host,
    port: config.mysqlConfig.port,
    timezone: process.env.TZ || 'PRC', // 设置时区
    operatorsAliases: false,
  },
);

const db = {};

fs.readdirSync(__dirname).filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
