const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllStudents } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Middleware import

// Public Routes (Bina login ke chalenge)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route (Teacher jab problem banayega tab students ki list aayegi)
router.get('/students', protect, getAllStudents);

module.exports = router;