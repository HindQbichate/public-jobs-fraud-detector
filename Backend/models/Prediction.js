// models/Prediction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prediction = sequelize.define('Prediction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  application_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false }, // Add this line
  prediction: { type: DataTypes.BOOLEAN, allowNull: false },
  result: { type: DataTypes.STRING }
}, {
  timestamps: true,
  tableName: 'predictions',
});

module.exports = Prediction;