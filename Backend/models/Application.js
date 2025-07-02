const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tender_id: { type: DataTypes.INTEGER, allowNull: false },
  company_id: { type: DataTypes.INTEGER, allowNull: false },

  // Copied company data
  company_experience_years: DataTypes.INTEGER,
  previous_similar_projects: DataTypes.INTEGER,
  total_employees: DataTypes.INTEGER,
  engineers_count: DataTypes.INTEGER,
  machinery_count: DataTypes.INTEGER,

  // Budget & duration
  offered_budget_MAD: DataTypes.BIGINT,
  estimated_budget_MAD: DataTypes.BIGINT,
  budget_difference_ratio: DataTypes.FLOAT,
  proposed_duration_days: DataTypes.INTEGER,

  // Copied tender road specs
  total_length_km: DataTypes.INTEGER,
  road_width_m: DataTypes.INTEGER,
  lanes: DataTypes.INTEGER,
  category: DataTypes.STRING,
  road_class: DataTypes.STRING,
  terrain_type: DataTypes.STRING,
  soil_type: DataTypes.STRING,
  slope: DataTypes.STRING,

  // Evaluation
  compliance_issues_count: DataTypes.INTEGER,
  technical_score: DataTypes.FLOAT,
  financial_score: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },

  is_fraud: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null
  }

}, {
  timestamps: true,
  tableName: 'applications',
});

module.exports = Application;
