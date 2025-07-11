const { Prediction, User } = require('../../models');

module.exports = async (req, res) => {
  try {
    const predictions = await Prediction.findAll({
      include: [{ model: User, attributes: ['id', 'fullName'] }],
    });

    const userMap = {};

    predictions.forEach(p => {
      const uid = p.User?.id;
      const name = p.User?.fullName || 'Unknown';
      if (!userMap[uid]) userMap[uid] = { user: name, count: 0 };
      userMap[uid].count++;
    });

    const result = Object.values(userMap).sort((a, b) => b.count - a.count);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
};
