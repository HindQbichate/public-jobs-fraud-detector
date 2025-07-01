const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'fraud-checker-app', brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function sendPredictionRequest(data) {
  await producer.connect();
  await producer.send({
    topic: 'request_ai_prediction',
    messages: [{ value: JSON.stringify(data) }]
  });
  await producer.disconnect();
  console.log('✅ Sent prediction to Python:', data.application_id);
}

module.exports = sendPredictionRequest;
