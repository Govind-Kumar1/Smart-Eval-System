const axios = require('axios');

// Dost ke API model ke hisaab se humein studentId, problemId aur context bhi bhejna hoga
const generateSmartHint = async (errorLog, language, studentId, problemId, problemTitle) => {
    try {
        // Tumhare dost ke Python FastAPI server ka default URL
        const aiServerUrl = 'http://127.0.0.1:8000/predict-topic'; 

        // Payload bilkul waisa hi hai jaisa dost ne README me manga hai
        const payload = {
            student_id: studentId.toString(),
            problem_id: problemId.toString(),
            problem_context: `Coding in ${language}. Problem: ${problemTitle}`,
            error_log: errorLog
        };

        // Python Server ko request bhejo
        const response = await axios.post(aiServerUrl, payload, {
            headers: { "Content-Type": "application/json" }
        });

        const data = response.data.prediction;

        // Student ko dikhane ke liye ek badhiya formatted string banao
        const formattedHint = `🧠 Recommended Topic: ${data.predicted_topic} (Confidence: ${data.confidence})\n💡 AI Explanation: ${data.explanation}`;

        return formattedHint;

    } catch (error) {
        console.error("❌ Python AI Service Down or Error:", error.message);
        // Agar dost ka server band ho, toh code crash na ho isliye ek default message:
        return "💡 Default Hint: Please check your syntax and logic carefully. (AI Engine Offline)"; 
    }
};

module.exports = { generateSmartHint };