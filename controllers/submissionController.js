const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { generateSmartHint } = require('../utils/aiLogic');

// --- JUDGE0 API HELPER ---
const runCodeOnJudge0 = async (code, languageId, input) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'true', fields: '*', wait: 'true' },
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            // Change 2: Data bhejne se pehle Encode kiya (Base64)
            source_code: Buffer.from(code).toString('base64'),
            language_id: languageId,
            stdin: input ? Buffer.from(input).toString('base64') : ""
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Judge0 API Error:", error.message);
        if(error.response) {
             console.error("API Response:", error.response.data);
        }
        return null;
    }
};

// Helper function to Decode Base64 safely
const decode = (str) => {
    return str ? Buffer.from(str, 'base64').toString('utf-8') : "";
};

// 1. Submit Code
const submitCode = async (req, res) => {
    try {
        const { studentId, problemId, code, language } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        // Language IDs
        let langId = 54; // C++
        if (language === 'python') langId = 71; 
        if (language === 'java') langId = 62;   

        let allPassed = true;
        let log = ""; 
        let passedCount = 0;

        for (const testCase of problem.testCases) {
            
            const result = await runCodeOnJudge0(code, langId, testCase.input);

            // Case 1: API Connection Failed
            if (!result) {
                allPassed = false;
                log = "Server Error: Could not connect to Judge0 API.";
                break;
            }

            // Case 2: Compilation Error (Status ID 6)
            if (result.status.id === 6) {
                allPassed = false;
                // Change 3: Output ko Decode karna padega
                log = "Compilation Error:\n" + decode(result.compile_output); 
                break;
            }

            // Case 3: Runtime Error (Status ID != 3)
            if (result.status.id !== 3) {
                allPassed = false;
                // Decode errors too
                log = decode(result.stderr) || result.status.description;
                break;
            }

            // Case 4: Logic Wrong
            // Change 4: Output bhi Base64 aayega, usse decode karo
            const actualOutput = decode(result.stdout).trim();
            const expectedOutput = testCase.output.trim();

            if (actualOutput !== expectedOutput) {
                allPassed = false;
                log = `Wrong Answer.\nInput: ${testCase.input}\nExpected: ${expectedOutput}\nGot: ${actualOutput}`;
                break;
            }

            passedCount++;
        }

        const status = allPassed ? "Passed" : "Failed";

        // AI Logic
        let aiHint = "";
        if (!allPassed) {
            aiHint = generateSmartHint(log, language);
        } else {
            aiHint = "🌟 AI Feedback: Excellent work! Your solution is correct.";
        }

       const newSubmission = new Submission({
            student: studentId, 
            problem: problemId,
            code,
            language,
            status,
            passedTestCases: passedCount,
            totalTestCases: problem.testCases.length, // <--- YE NAYI LINE HAI
            errorLog: log,
            aiRecommendation: aiHint, 
            teacherFeedback: "" 
        });

        await newSubmission.save();

        await newSubmission.save();

        res.status(201).json({ 
            message: "Submission Processed", 
            result: newSubmission 
        });

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.params.userId })
            .populate('problem', 'title')
            .sort({ createdAt: -1 }); 
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addFeedback = async (req, res) => {
    try {
        const { submissionId, feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            { teacherFeedback: feedback },
            { new: true }
        );
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitCode, getUserSubmissions, addFeedback };