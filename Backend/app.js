const express = require('express');
const app = express();
const predictionRoutes = require('./routes/predictionRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());

app.use('/api', predictionRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
