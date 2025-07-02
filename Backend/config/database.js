const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fraud_detection', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
