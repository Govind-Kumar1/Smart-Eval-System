const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

// Code Run karne ke liye Helper Function
const runCodeOnJudge0 = async (code, languageId, input) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'false', fields: '*', wait: 'true' },
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            source_code: code,
            language_id: languageId,
            stdin: input
        }
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        return null;
    }
};

const submitCode = async (req, res) => {
    try {
        const { studentId, problemId, code, language } = req.body;

        // 1. Problem dhundo taaki test cases mil sakein
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        // Language Mapping
        let langId = 54; // C++
        if (language === 'python') langId = 71;
        if (language === 'java') langId = 62;

        let allPassed = true;
        let log = "";
        let passedCount = 0;

        // 2. Har Test Case ke liye code run karo
        // (Note: Free API me rate limit hoti hai, isliye abhi loop chhota rakhenge)
        for (const testCase of problem.testCases) {
            const result = await runCodeOnJudge0(code, langId, testCase.input);

            if (!result || result.status.id !== 3) { // 3 means Accepted/Success
                allPassed = false;
                log = result ? result.stderr || "Runtime Error" : "API Error";
                break; // Ek bhi fail hua toh loop rok do
            }

            // Output compare karo (trim() use karte hain taaki extra spaces ignore ho jaye)
            if (result.stdout.trim() !== testCase.output.trim()) {
                allPassed = false;
                log = `Failed at Input: ${testCase.input}. Expected: ${testCase.output}, Got: ${result.stdout}`;
                break;
            }

            passedCount++;
        }

        // 3. Status set karo
        const status = allPassed ? "Passed" : "Failed";

        // 4. Submission Database me save karo
        const newSubmission = new Submission({
            student: studentId, // Frontend se user ID aayegi
            problem: problemId,
            code,
            language,
            status,
            passedTestCases: passedCount,
            errorLog: log
        });

        await newSubmission.save();

        res.status(201).json({ 
            message: "Submission Processed", 
            result: newSubmission 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Student ki saari history dekhne ke liye
const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.params.userId }).populate('problem', 'title');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitCode, getUserSubmissions };