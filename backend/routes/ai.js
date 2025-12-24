const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

router.post('/optimize', auth, aiController.optimizeContent);
router.post('/scan', auth, aiController.scanATS);

module.exports = router;
