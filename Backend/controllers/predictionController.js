const { Prediction,User,Application,Company,ImportedTender  } = require('../models');
const { sanitizeForModel } = require('../services/predictionProcessor');

const sendPredictionRequest = require('../kafka/kafkaProducer');
const { waitForPredictionResponse } = require('../kafka/kafkaResponseConsumer');

// 🔍 Kafka-powered fraud prediction

exports.predictFraud = async (req, res) => {
  const application = req.body;
  const application_id = application.id;

  if (!application_id) {
    return res.status(400).json({ error: 'Missing application ID' });
  }

  const sanitized = sanitizeForModel(application);
  sanitized.application_id = application_id;

  let responded = false;

  try {
    waitForPredictionResponse(application_id, async (response) => {
      if (responded) return;
      responded = true;

      try {
        await Prediction.create({
          application_id: response.application_id,
          user_id: req.user.id,
          prediction: response.prediction,
          result: response.result
        });

        res.status(200).json({
          application_id: response.application_id,
          prediction: response.prediction,
          result: response.result
        });
      } catch (dbErr) {
        console.error('❌ Failed to save prediction:', dbErr.message);
        res.status(500).json({ error: 'Prediction save failed' });
      }
    });

    console.log('📤 Sending to Kafka:', sanitized);
    await sendPredictionRequest(sanitized);

    setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(504).json({ error: 'AI model timeout (no response)' });
      }
    }, 10000);

  } catch (err) {
    console.error('❌ Kafka prediction error:', err);
    if (!responded) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


// ➕ Create a new prediction record manually
exports.createPrediction = async (req, res) => {
  try {
    const { application_id, prediction, result } = req.body;

    console.log("user:"+req.user) 
    const newPrediction = await Prediction.create({
      application_id,
      user_id: req.user.id, // Assuming you have user info in req.user
      prediction,
      result
    });

    res.status(201).json(newPrediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get all predictions
exports.getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email', 'role']
        },
        {
          model: Application,
          attributes: ['id', 'offered_budget_MAD', 'estimated_budget_MAD'],
          include: [
            {
              model: Company,
              attributes: ['id', 'name']
            },
            {
              model: ImportedTender,
              attributes: ['id', 'region', 'province', 'category', 'road_class', 'terrain_type', 'soil_type', 'slope']
            }
          ]
        }
      ]
    });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔍 Get a specific prediction by ID
exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findByPk(req.params.id);
    if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 Update an existing prediction
exports.updatePrediction = async (req, res) => {
  try {
    const [updated] = await Prediction.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: 'Prediction not found' });
    res.json({ message: 'Prediction updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete a prediction
exports.deletePrediction = async (req, res) => {
  try {
    const deleted = await Prediction.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Prediction not found' });
    res.json({ message: 'Prediction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
