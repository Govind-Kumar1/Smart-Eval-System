const generateSmartHint = (errorLog, language) => {
    if (!errorLog) return "Great job! Code is clean.";

    const error = errorLog.toLowerCase();

    // --- C++ Analysis ---
    if (language === 'cpp' || language === 54) {
        if (error.includes("expected ';'")) return "🤖 AI Hint: You missed a semicolon (;) at the end of a line. Check the line number mentioned in the error.";
        if (error.includes("was not declared")) return "🤖 AI Hint: You are using a variable that hasn't been created yet. Check for typos!";
        if (error.includes("segmentation fault")) return "🤖 AI Hint: Critical Error! You might be accessing an array index that doesn't exist (Out of Bounds).";
        if (error.includes("infinite loop") || error.includes("time limit")) return "🤖 AI Hint: Your loop is running forever. Check your stopping condition (i < n).";
    }

    // --- Python Analysis ---
    if (language === 'python' || language === 71) {
        if (error.includes("indentationerror")) return "🤖 AI Hint: Python is strict about spaces. Make sure all your code blocks are aligned correctly.";
        if (error.includes("syntaxerror")) return "🤖 AI Hint: Check your syntax. Did you forget a colon (:) after 'if', 'for', or 'def'?";
        if (error.includes("nameerror")) return "🤖 AI Hint: Variable not found. Did you spell it correctly?";
    }

    // --- Logical Errors (Wrong Answer) ---
    if (error.includes("wrong answer")) {
        return "🤖 AI Logic Hint: Your code compiled successfully, but the output logic is incorrect. Try dry-running with the example input.";
    }

    return "🤖 AI Hint: Read the error message carefully, specifically the line number.";
};

module.exports = { generateSmartHint };