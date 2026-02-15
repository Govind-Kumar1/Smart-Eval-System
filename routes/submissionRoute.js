const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions } = require('../controllers/submissionController');

// Code submit karna
router.post('/', submitCode);

// Kisi student ki history dekhna
router.get('/:userId', getUserSubmissions);

module.exports = router;