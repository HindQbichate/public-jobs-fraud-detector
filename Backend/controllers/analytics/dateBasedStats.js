const { sequelize } = require('../../models');
const { QueryTypes } = require('sequelize');

// 📆 1. Fraud per YEAR
exports.fraudPerYear = async (req, res) => {
  try {
    const results = await sequelize.query(
      `
      SELECT 
        YEAR(createdAt) AS year,
        SUM(CASE WHEN is_fraud = true THEN 1 ELSE 0 END) AS fraud_count,
        SUM(CASE WHEN is_fraud = false THEN 1 ELSE 0 END) AS legit_count
      FROM applications
      GROUP BY year
      ORDER BY year
      `,
      { type: QueryTypes.SELECT }
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading fraudPerYear' });
  }
};

// 📆 2. Fraud per MONTH (in a specific year)
exports.fraudPerMonth = async (req, res) => {
  const { year } = req.params;
  try {
    const results = await sequelize.query(
      `
      SELECT 
        MONTH(createdAt) AS month,
        SUM(CASE WHEN is_fraud = true THEN 1 ELSE 0 END) AS fraud_count,
        SUM(CASE WHEN is_fraud = false THEN 1 ELSE 0 END) AS legit_count
      FROM applications
      WHERE YEAR(createdAt) = :year
      GROUP BY month
      ORDER BY month
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { year }
      }
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading fraudPerMonth' });
  }
};

// 📆 3. Fraud per DAY (in a specific month and year)
exports.fraudPerDay = async (req, res) => {
  const { year, month } = req.params;
  try {
    const results = await sequelize.query(
      `
      SELECT 
        DAY(createdAt) AS day,
        SUM(CASE WHEN is_fraud = true THEN 1 ELSE 0 END) AS fraud_count,
        SUM(CASE WHEN is_fraud = false THEN 1 ELSE 0 END) AS legit_count
      FROM applications
      WHERE YEAR(createdAt) = :year AND MONTH(createdAt) = :month
      GROUP BY day
      ORDER BY day
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { year, month }
      }
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loading fraudPerDay' });
  }
};
