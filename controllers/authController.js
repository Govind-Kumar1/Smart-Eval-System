const User = require('../models/Users'); // Jo User model humne pehle banaya tha
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER LOGIC
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check karo user pehle se hai kya?
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Password ko encrypt (hash) karo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user banao
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'student' // Default student rahega
        });

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. LOGIN LOGIC
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User dhundo
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Password match karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Token generate karo (Ye user ka ID card hai)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "supersecretkey", // .env me daal denge baad me
            { expiresIn: "1d" }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };