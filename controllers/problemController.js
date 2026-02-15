const Problem = require('../models/Problem');

// 1. Create Problem (Sirf Teacher ke liye)
const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, testCases } = req.body;

        // Validation: Test cases zaroori hain evaluation ke liye
        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ message: "At least one test case is required" });
        }

        const newProblem = new Problem({
            title,
            description,
            difficulty,
            testCases 
        });

        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Problems (Student list dekh sakega)
const getProblems = async (req, res) => {
    try {
        // Hum test cases return nahi karenge taaki student cheat na kar sake
        const problems = await Problem.find().select('-testCases'); 
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Single Problem by ID
const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).select('-testCases');
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createProblem, getProblems, getProblemById };