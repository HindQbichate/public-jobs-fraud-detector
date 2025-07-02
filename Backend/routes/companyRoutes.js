const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Contractor company data
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *         foundation_date:
 *           type: string
 *           format: date
 *         previous_similar_projects:
 *           type: integer
 *         total_employees:
 *           type: integer
 *         engineers_count:
 *           type: integer
 *         machinery_count:
 *           type: integer
 *         compliance_issues_count:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 */
router.post('/', authenticateToken, companyController.createCompany);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/', authenticateToken, companyController.getAllCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/:id', authenticateToken, companyController.getCompanyById);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated
 *       404:
 *         description: Company not found
 */
router.put('/:id', authenticateToken, companyController.updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted
 *       404:
 *         description: Company not found
 */
router.delete('/:id', authenticateToken, companyController.deleteCompany);

module.exports = router;
