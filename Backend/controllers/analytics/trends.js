const { Prediction } = require('../../models');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 30);

    const predictions = await Prediction.findAll({
      where: { createdAt: { [Op.gte]: daysAgo } },
      attributes: ['createdAt', 'prediction'],
      raw: true,
    });

    const trendMap = {};

    predictions.forEach(({ createdAt, prediction }) => {
      const date = createdAt.toISOString().split('T')[0];
      if (!trendMap[date]) trendMap[date] = { date, fraud: 0, legit: 0 };
      if (prediction) trendMap[date].fraud++;
      else trendMap[date].legit++;
    });

    const sortedTrend = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(sortedTrend);
  } catch (err) {
    console.error('[Error] Prediction trend:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
