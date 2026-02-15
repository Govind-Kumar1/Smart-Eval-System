const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const compileRoute = require('./routes/compileRoute');
const authRoute = require('./routes/authRoute');
const problemRoute = require('./routes/problemRoute');
const submissionRoute = require('./routes/submissionRoute');
 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());


// Routes  
app.use('/api/compile', compileRoute);
app.use('/api/auth', authRoute);
app.use('/api/problems', problemRoute);

app.use('/api/submissions', submissionRoute);


//Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected")) 
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Smart Eval API is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});