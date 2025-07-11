const express = require('express');
const router = express.Router();
const { fraudPerYear, fraudPerMonth, fraudPerDay } = require('../controllers/analytics/dateBasedStats');
const totals = require('../controllers/analytics/totals');
const trends = require('../controllers/analytics/trends');
const userStats = require('../controllers/analytics/userStats');

const { authenticateToken } = require('../middlewares/authMiddleware');



router.get('/totals', totals);
router.get('/trends', trends);
router.get('/user-stats', userStats);

router.get('/fraud-per-year',authenticateToken, fraudPerYear);
router.get('/fraud-per-month/:year', authenticateToken,fraudPerMonth);
router.get('/fraud-per-day/:year/:month',authenticateToken, fraudPerDay);

module.exports = router;
