const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/importedTenderController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tenders
 *   description: Public infrastructure tender data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ImportedTender:
 *       type: object
 *       required:
 *         - source_id
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated tender ID
 *         source_id:
 *           type: string
 *           description: ID from the external tender source
 *         title:
 *           type: string
 *         region:
 *           type: string
 *         province:
 *           type: string
 *         category:
 *           type: string
 *           enum: [Autoroute, National, Regional, Provincial]
 *         road_class:
 *           type: string
 *           enum: [Primary, Secondary, Tertiary]
 *         total_length_km:
 *           type: integer
 *         road_width_m:
 *           type: integer
 *         lanes:
 *           type: integer
 *         terrain_type:
 *           type: string
 *         soil_type:
 *           type: string
 *         slope:
 *           type: string
 *         estimated_budget_MAD:
 *           type: integer
 *         source_url:
 *           type: string
 *           format: uri
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tenders:
 *   post:
 *     summary: Create a new tender
 *     tags: [Tenders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImportedTender'
 *     responses:
 *       201:
 *         description: Tender created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportedTender'
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, tenderController.createTender);

/**
 * @swagger
 * /api/tenders:
 *   get:
 *     summary: Get all tenders
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: List of all tenders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImportedTender'
 */
router.get('/', authenticateToken, tenderController.getAllTenders);

/**
 * @swagger
 * /api/tenders/{id}:
 *   get:
 *     summary: Get a tender by ID
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tender ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tender found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportedTender'
 *       404:
 *         description: Tender not found
 */
router.get('/:id', authenticateToken, tenderController.getTenderById);

/**
 * @swagger
 * /api/tenders/{id}:
 *   put:
 *     summary: Update a tender
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tender ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImportedTender'
 *     responses:
 *       200:
 *         description: Tender updated successfully
 *       400:
 *         description: Invalid update input
 *       404:
 *         description: Tender not found
 */
router.put('/:id', authenticateToken, tenderController.updateTender);

/**
 * @swagger
 * /api/tenders/{id}:
 *   delete:
 *     summary: Delete a tender
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tender ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tender deleted
 *       404:
 *         description: Tender not found
 */
router.delete('/:id', authenticateToken, tenderController.deleteTender);

module.exports = router;
