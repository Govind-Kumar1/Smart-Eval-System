const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions, addFeedback } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// 1. Code Submit karna (Student ke liye - Final Evaluation)
router.post('/', protect, submitCode);

// 2. History dekhna (Student/Teacher ke liye)
router.get('/:userId', protect, getUserSubmissions);

// 3. Teacher Feedback Add karna 
router.post('/feedback', protect, addFeedback);

module.exports = router;