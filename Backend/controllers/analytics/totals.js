const { Application } = require('../../models');

module.exports = async (req, res) => {
  try {
    const total = await Application.count();
    // Count fraudulent applications based on associated Prediction.result === true
    const fraud = await Application.count({
      include: [{
        model: require('../../models').Prediction,
        attributes: [],
        where: { prediction: true }
      }]
    });

    // Count legitimate applications based on associated Prediction.result === false
    const legit = await Application.count({
      include: [{ 
        model: require('../../models').Prediction,
        attributes: [],
        where: { prediction: false }
      }]
    });

    res.json({ total, fraud, legit, fraudRate: ((fraud / total) * 100).toFixed(1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
};
