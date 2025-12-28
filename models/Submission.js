const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: { type: String, required: true },
  language: { type: String, default: 'cpp' }, // cpp, java, python
  status: { 
    type: String, 
    enum: ['Passed', 'Failed', 'Compilation Error', 'Runtime Error'] 
  },
  // Agar error aaya toh yahan store hoga (AI analysis ke liye)
  errorLog: { type: String }, 
  // Kitne test cases pass hue (e.g., 3/5)
  passedTestCases: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);