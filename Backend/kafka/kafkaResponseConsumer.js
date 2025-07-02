const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'fraud-checker-app', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'fraud-checker-result-group' });

const listeners = {}; // Callbacks by application_id

async function startConsumer() {
  await consumer.connect();
  console.log('🔌 Kafka consumer connected');

  await consumer.subscribe({ topic: 'response_ai_prediction', fromBeginning: false });
  console.log('📡 Subscribed to topic: response_ai_prediction');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const msgString = message.value.toString();
      let msg;

      try {
        msg = JSON.parse(msgString);
      } catch (err) {
        console.error('❌ Invalid message format:', msgString);
        return;
      }

      const appId = msg.application_id;
      console.log(`📨 Received Kafka message for application_id: ${appId}`);

      if (listeners[appId]) {
        console.log(`✅ Matched callback for application_id: ${appId}`);
        listeners[appId](msg);
        delete listeners[appId];
      } else {
        console.warn(`⚠️ No matching listener for application_id: ${appId}`);
      }
    }
  });
}

// Registers a one-time listener for a specific app ID
function waitForPredictionResponse(application_id, callback) {
  listeners[application_id] = callback;
  console.log(`👂 Waiting for response for application_id: ${application_id}`);
}

module.exports = {
  waitForPredictionResponse,
  startConsumer
};
