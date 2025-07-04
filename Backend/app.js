
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const routes = require('./routes');
const db = require('./models');
const { startConsumer } = require('./kafka/kafkaResponseConsumer');
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend
  credentials: true // if you're sending cookies or auth headers
}));

app.use(express.json());


startConsumer()
    .then(() => console.log('🟢 Kafka prediction consumer ready'))
    .catch(err => console.error('❌ Failed to start Kafka consumer:', err));

// Optional test connection
db.sequelize.authenticate()
    .then(() => console.log('✅ Database connected'))
    .catch(err => console.error('❌ Database connection error:', err));

// Sync DB
db.sequelize.sync({ alter: true }) // or force: true to recreate
    .then(() => {
        console.log('✅ Models synced');
        // Start the server only after sync 
    })
    .catch(err => console.error('❌ Sync error:', err));

app.use('/api', routes); // Prefix all with /api


app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
