const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImportedTender = sequelize.define('ImportedTender', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  source_id: DataTypes.STRING,
  title: DataTypes.STRING,
  region: DataTypes.STRING,
  province: DataTypes.STRING,
  category: DataTypes.ENUM('Autoroute', 'National', 'Regional', 'Provincial'),
  road_class: DataTypes.ENUM('Primary', 'Secondary'),
  total_length_km: DataTypes.INTEGER,
  road_width_m: DataTypes.INTEGER,
  lanes: DataTypes.INTEGER,
  terrain_type: DataTypes.ENUM('Flat', 'Mixed', 'Coastal','Mountainous','Desert'),
  soil_type: DataTypes.ENUM('Sandy', 'Clay', 'Rocky'),
  slope: DataTypes.ENUM('High', 'Low', 'Moderate'),
  estimated_budget_MAD: DataTypes.BIGINT,
}, {
  timestamps: true,
  tableName: 'imported_tenders',
});

module.exports = ImportedTender;
