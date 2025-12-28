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
  // Students ke liye weak areas track karne ke liye
  weakAreas: [{ type: String }], 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);