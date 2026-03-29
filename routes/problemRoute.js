const express = require('express');
const router = express.Router();
const { 
    createProblem, 
    getProblems, 
    getProblemById, 
    updateProblem, 
    deleteProblem 
} = require('../controllers/problemController');

const { protect } = require('../middleware/authMiddleware');

// --- AB SARE ROUTES PROTECTED HAIN ---

// 1. Get problems (Teacher apni dekhega, Student assigned wali dekhega)
router.get('/', protect, getProblems); 

// 2. Get single problem by ID
router.get('/:id', protect, getProblemById);

// 3. Create Problem (Teacher)
router.post('/create', protect, createProblem);

// 4. Update Problem (Teacher)
router.put('/:id', protect, updateProblem);

// 5. Delete Problem (Teacher)
router.delete('/:id', protect, deleteProblem);

module.exports = router;