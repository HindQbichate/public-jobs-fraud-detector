const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/tenders', require('./importedTenderRoutes'));
router.use('/applications', require('./applicationRoutes'));
router.use('/predictions', require('./predictionRoutes'));
router.use('/companies', require('./companyRoutes'));

module.exports = router;
