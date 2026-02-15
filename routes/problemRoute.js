const express = require('express');
const router = express.Router();
const { createProblem, getProblems, getProblemById } = require('../controllers/problemController');

// 1. Middleware Import karo (Ye Security Guards hain)
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Routes

// 2. Yahan 'protect' aur 'teacherOnly' laga do
// Flow: Pehle login check (protect) -> Fir role check (teacherOnly) -> Fir Problem create
router.post('/create', protect, teacherOnly, createProblem); 

// Baaki routes sabke liye open rahenge (Students problems dekh sakein)
router.get('/', getProblems);          
router.get('/:id', getProblemById);    

module.exports = router;