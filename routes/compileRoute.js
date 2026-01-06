const express = require('express');
const router = express.Router();

// Controller ko import karo
const { compileCode } = require('../controllers/compileController');

// POST request aane par controller function chalao
router.post('/', compileCode);

module.exports = router;