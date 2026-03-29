const axios = require('axios');

// Helper function: Base64 se wapas normal text (UTF-8) mein badalne ke liye
const decode = (str) => {
    return str ? Buffer.from(str, 'base64').toString('utf-8') : "";
};

const compileCode = async (req, res) => {
    // 1. Frontend se data receive karo
    const { code, language, input } = req.body;

    // 2. Language ID mapping set karo (Judge0 ke hisaab se)
    let langId = 54; // Default C++ (GCC 9.2.0)
    if (language === 'python') langId = 71; // Python (3.8.1)
    if (language === 'java') langId = 62;   // Java (OpenJDK 13.0.1)

    // 3. Request Options Set karo (Base64 Enabled)
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        // Yahan base64_encoded 'true' karna zaroori hai UTF-8 errors rokne ke liye
        params: { base64_encoded: 'true', fields: '*', wait: 'true' }, 
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Tumhari .env file se key aayegi
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            // Data bhejne se pehle Encode karo
            source_code: Buffer.from(code).toString('base64'),
            language_id: langId,
            stdin: input ? Buffer.from(input).toString('base64') : ""
        }
    };

    // 4. API Call aur Response Handling
    try {
        const response = await axios.request(options);
        const data = response.data;

        // 5. Judge0 se result Base64 me aayega, usko frontend pe bhejne se pehle Decode karo
        if (data.stdout) data.stdout = decode(data.stdout);
        if (data.stderr) data.stderr = decode(data.stderr);
        if (data.compile_output) data.compile_output = decode(data.compile_output);
        if (data.message) data.message = decode(data.message);

        console.log("Compile Success 🚀"); 
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Compile Error:", error.message);
        res.status(500).json({ 
            error: "Compilation Failed", 
            details: error.response ? error.response.data : error.message 
        });
    }
};

module.exports = { compileCode };