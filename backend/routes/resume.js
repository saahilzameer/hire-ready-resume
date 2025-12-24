const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, resumeController.saveResume);
router.get('/', auth, resumeController.getResumes);
router.get('/:id', auth, resumeController.getResumeById);
router.put('/:id', auth, resumeController.updateResume);
router.post('/:id/deploy', auth, resumeController.deployResume);
router.get('/public/:slug', resumeController.getPublicResume);
router.get('/:id/pdf', auth, resumeController.generatePDF);

module.exports = router;
