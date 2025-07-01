const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'fraud-checker-app', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'fraud-checker-result-group' });

const listeners = {}; // Dictionary to store callbacks by application_id

async function waitForPredictionResponse(targetId, callback) {
  listeners[targetId] = callback;
  console.log(`👂 Waiting for response for application_id: ${targetId}`);

  try {
    await consumer.connect();
    console.log('🔌 Kafka consumer connected');

    await consumer.subscribe({ topic: 'response_ai_prediction', fromBeginning: false });
    console.log('📡 Subscribed to topic: response_ai_prediction');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const msgString = message.value.toString();
        let msg;

        try {
          msg = JSON.parse(msgString);
        } catch (err) {
          console.error('❌ Failed to parse Kafka message:', msgString);
          return;
        }
 
        const appId = msg.application_id;
        console.log(`📨 Received Kafka message for application_id: ${appId}`);

        if (listeners[appId]) {
          console.log(`✅ Matched response for application_id: ${appId}`);
          listeners[appId](msg); // Call the original callback
          delete listeners[appId];
        } else {
          console.warn(`⚠️ No matching listener for application_id: ${appId}`);
        }
      }
    });

  } catch (err) {
    console.error('❌ Kafka consumer error:', err);
  }
}

module.exports = waitForPredictionResponse;
