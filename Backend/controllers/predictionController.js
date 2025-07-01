const sendPredictionRequest = require('../kafka/kafkaProducer');
const waitForPredictionResponse = require('../kafka/kafkaResponseConsumer');

exports.predictFraud = async (req, res) => {
  const application = req.body;
  application.application_id = Date.now();

  let responded = false;

  try {
    await sendPredictionRequest(application);

    // Wait for response from Kafka
    waitForPredictionResponse(application.application_id, (response) => {
      if (responded) return;
      responded = true;

      res.status(200).json({
        application_id: response.application_id,
        prediction: response.prediction,
        result: response.result
      });
    });

    // Safety timeout
    setTimeout(() => {
      if (responded) return;
      responded = true;

      res.status(504).json({ error: 'AI model timeout (no response)' });
    }, 10000);

  } catch (err) {
    console.error('Kafka prediction error:', err);
    if (!responded) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
