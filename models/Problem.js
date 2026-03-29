const mongoose = require('mongoose');

// Test Case ke liye alag se schema define karna better practice hai
const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Easy' 
  },
  // Teacher ka reference (Kisne problem banayi hai)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- NAYA FIELD ---
  // Jin students ko assign kiya gaya hai unki ID yahan save hogi
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Hidden test cases for evaluation
  testCases: [testCaseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);