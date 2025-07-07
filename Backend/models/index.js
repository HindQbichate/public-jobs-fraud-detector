// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const ImportedTender = require('./ImportedTender');
const Application = require('./Application');
const Prediction = require('./Prediction');

// Associations

Company.hasMany(Application, { foreignKey: 'company_id' });
Application.belongsTo(Company, { foreignKey: 'company_id' });

ImportedTender.hasMany(Application, { foreignKey: 'tender_id' });
Application.belongsTo(ImportedTender, { foreignKey: 'tender_id' });

Application.hasOne(Prediction, { foreignKey: 'application_id' });
Prediction.belongsTo(Application, { foreignKey: 'application_id' });

// Add these new associations
User.hasMany(Prediction, { foreignKey: 'user_id' });
Prediction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User, 
  Company,
  ImportedTender,
  Application,
  Prediction
};