const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/predictions/predict:
 *   post:
 *     summary: Send a road project proposal to AI for fraud detection
 *     tags: [Prediction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PredictionInput'
 *           examples:
 *             Legitimate:
 *               summary: Legitimate Application Example
 *               value:
 *                 company_experience_years: 10
 *                 previous_similar_projects: 4
 *                 total_employees: 300
 *                 engineers_count: 10
 *                 machinery_count: 25
 *                 offered_budget_MAD: 120000000
 *                 estimated_budget_MAD: 118000000
 *                 budget_difference_ratio: 0.017
 *                 proposed_duration_days: 180
 *                 total_length_km: 100
 *                 road_width_m: 7
 *                 lanes: 2
 *                 category: National
 *                 road_class: Primary
 *                 terrain_type: Flat
 *                 soil_type: Sandy
 *                 slope: Low
 *                 compliance_issues_count: 0
 *                 technical_score: 92.5
 *                 financial_score: 98.0
 *             Fraudulent:
 *               summary: Fraudulent Application Example
 *               value:
 *                 company_experience_years: 2
 *                 previous_similar_projects: 0
 *                 total_employees: 40
 *                 engineers_count: 1
 *                 machinery_count: 3
 *                 offered_budget_MAD: 60000000
 *                 estimated_budget_MAD: 140000000
 *                 budget_difference_ratio: -0.5714
 *                 proposed_duration_days: 500
 *                 total_length_km: 180
 *                 road_width_m: 14
 *                 lanes: 4
 *                 category: Autoroute
 *                 road_class: Primary
 *                 terrain_type: Mountainous
 *                 soil_type: Rocky
 *                 slope: High
 *                 compliance_issues_count: 3
 *                 technical_score: 44.0
 *                 financial_score: 60.5
 *     responses:
 *       200:
 *         description: Prédiction renvoyée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application_id:
 *                   type: integer
 *                 prediction:
 *                   type: integer
 *                 result:
 *                   type: string
 *       504:
 *         description: Timeout
 */

router.post('/predict', authenticateToken, predictionController.predictFraud);



/**
 * @swagger
 * components:
 *   schemas:
 *     Prediction:
 *       type: object
 *       required:
 *         - application_id
 *         - prediction
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         application_id:
 *           type: integer
 *           description: FK to the related application
 *         prediction:
 *           type: boolean
 *           description: true = fraud, false = not fraud
 *         result:
 *           type: string
 *           description: Optional explanation or model output
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/predictions:
 *   post:
 *     summary: Create a prediction manually
 *     tags: [Predictions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prediction'
 *     responses:
 *       201:
 *         description: Prediction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prediction'
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, predictionController.createPrediction);

/**
 * @swagger
 * /api/predictions:
 *   get:
 *     summary: Get all prediction records
 *     tags: [Predictions]
 *     responses:
 *       200:
 *         description: List of predictions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prediction'
 */
router.get('/', authenticateToken, predictionController.getAllPredictions);

/**
 * @swagger
 * /api/predictions/{id}:
 *   get:
 *     summary: Get a prediction by ID
 *     tags: [Predictions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prediction ID
 *     responses:
 *       200:
 *         description: Prediction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prediction'
 *       404:
 *         description: Prediction not found
 */
router.get('/:id', authenticateToken, predictionController.getPredictionById);

/**
 * @swagger
 * /api/predictions/{id}:
 *   put:
 *     summary: Update a prediction
 *     tags: [Predictions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prediction ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prediction'
 *     responses:
 *       200:
 *         description: Prediction updated
 *       404:
 *         description: Prediction not found
 */
router.put('/:id', authenticateToken, predictionController.updatePrediction);

/**
 * @swagger
 * /api/predictions/{id}:
 *   delete:
 *     summary: Delete a prediction
 *     tags: [Predictions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Prediction ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prediction deleted
 *       404:
 *         description: Prediction not found
 */
router.delete('/:id', authenticateToken, predictionController.deletePrediction);

module.exports = router;