const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: DataTypes.STRING,
  email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(150), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'contractor', 'viewer'), allowNull: false }
}, {
  timestamps: true,
  tableName: 'users',
});

module.exports = User;
