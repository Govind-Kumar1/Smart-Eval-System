const express = require('express');
const router = express.Router();

// Controller ko import karo
const { compileCode } = require('../controllers/compileController');

// POST request aane par code compile/run hoga (Piston/Judge0 ke through)
router.post('/', compileCode);

module.exports = router;