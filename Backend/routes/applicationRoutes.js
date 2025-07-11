const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const {seed} = require('../controllers/seed');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Contractor application management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - user_id
 *         - tender_id
 *         - company_id
 *         - offered_budget_MAD
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         user_id:
 *           type: integer
 *           description: The user submitting the application
 *         tender_id:
 *           type: integer
 *           description: The tender being applied for
 *         company_id:
 *           type: integer
 *           description: The company making the application
 *         company_experience_years:
 *           type: integer
 *         previous_similar_projects:
 *           type: integer
 *         total_employees:
 *           type: integer
 *         engineers_count:
 *           type: integer
 *         machinery_count:
 *           type: integer
 *         offered_budget_MAD:
 *           type: integer
 *         estimated_budget_MAD:
 *           type: integer
 *         budget_difference_ratio:
 *           type: number
 *         proposed_duration_days:
 *           type: integer
 *         total_length_km:
 *           type: integer
 *         road_width_m:
 *           type: integer
 *         lanes:
 *           type: integer
 *         category:
 *           type: string
 *         road_class:
 *           type: string
 *         terrain_type:
 *           type: string
 *         soil_type:
 *           type: string
 *         slope:
 *           type: string
 *         compliance_issues_count:
 *           type: integer
 *         technical_score:
 *           type: number
 *         financial_score:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         is_fraud:
 *           type: boolean
 *           nullable: true
 *           description: Set after AI prediction (true, false, or null)
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a contractor application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, applicationController.createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of all applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/', authenticateToken, applicationController.getAllApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.get('/:id', authenticateToken, applicationController.getApplicationById);

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update an existing application
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Invalid update input
 *       404:
 *         description: Application not found
 */
router.put('/:id', authenticateToken, applicationController.updateApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted
 *       404:
 *         description: Application not found
 */
router.delete('/:id', authenticateToken, applicationController.deleteApplication);



router.post('/seed-applications', seed);


module.exports = router;


