const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// 1. Check if User is Logged In (Token Verification)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token nikalo (Bearer <token>) 
            token = req.headers.authorization.split(' ')[1];

            // Verify karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

            // User ko find karke request object me daal do
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Aage badho
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// 2. Check Role (Teacher Only)
const teacherOnly = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next(); // Teacher hai, jaane do
    } else {
        res.status(403).json({ message: "Not authorized as a teacher" });
    }
};

module.exports = { protect, teacherOnly };