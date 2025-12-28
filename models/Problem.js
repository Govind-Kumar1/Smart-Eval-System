const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Easy' 
  },
  // Teacher ka reference (kisne banaya)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Hidden test cases for evaluation
  testCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);