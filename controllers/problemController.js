const Problem = require('../models/Problem');

// 1. Create Problem 
const createProblem = async (req, res) => {
    try {
        // assignedTo array req.body se aayega
        const { title, description, difficulty, testCases, assignedTo } = req.body;

        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ message: "At least one test case is required" });
        }

        const newProblem = new Problem({
            title,
            description,
            difficulty,
            testCases,
            createdBy: req.user.id, // Teacher ki ID token se aayegi
            assignedTo: assignedTo || [] // Kis-kis student ko assign kiya
        });

        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Problems (SMART FILTER)
const getProblems = async (req, res) => {
    try {
        let problems;

        // Agar user Teacher hai -> Uski banayi hui problems dikhao
        if (req.user.role === 'teacher') {
            problems = await Problem.find({ createdBy: req.user.id }).select('-testCases');
        } 
        // Agar user Student hai -> Sirf wahi dikhao jo use assign hui hain
        else {
            problems = await Problem.find({ assignedTo: req.user.id }).select('-testCases');
        }

        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Single Problem by ID
const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ message: "Problem not found" });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Problem
const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, difficulty, testCases, assignedTo } = req.body;

        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            { title, description, difficulty, testCases, assignedTo },
            { new: true } 
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(updatedProblem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Problem
const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json({ message: "Problem deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createProblem, getProblems, getProblemById, updateProblem, deleteProblem };