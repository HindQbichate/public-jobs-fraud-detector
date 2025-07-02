const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  foundation_date: { type: DataTypes.DATE },
  previous_similar_projects: DataTypes.INTEGER,
  total_employees: DataTypes.INTEGER,
  engineers_count: DataTypes.INTEGER,
  machinery_count: DataTypes.INTEGER,
  compliance_issues_count: DataTypes.INTEGER
}, {
  timestamps: true,
  tableName: 'companies',
});

module.exports = Company;
