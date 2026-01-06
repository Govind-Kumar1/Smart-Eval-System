const axios = require('axios');

const compileCode = async (req, res) => {
    // 1. User se data lo
    const { code, language, input } = req.body;

    // 2. Language ID mapping set karo
    let langId = 54; // Default C++ (GCC 9.2.0)
    if (language === 'python') langId = 71; // Python (3.8.1)
    if (language === 'java') langId = 62;   // Java (OpenJDK 13.0.1)

    // 3. Request Options Set karo
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
            language_id: langId,
            stdin: input || ""
        }
    };

    // 4. API Call aur Response Handling
    try {
        const response = await axios.request(options);
        console.log("Compile Success"); // Console me print hoga debugging ke liye
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Compile Error:", error.message);
        res.status(500).json({ 
            error: "Compilation Failed", 
            details: error.response ? error.response.data : error.message 
        });
    }
};

module.exports = { compileCode };