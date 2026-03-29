const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher'], 
    default: 'student' 
  },
  // Students ke weak areas track karne ke liye (AI analysis ke kaam aayega)
  weakAreas: [{ type: String }], 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);