const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setup.controller');

// Rutas públicas para el setup inicial
router.get('/check', setupController.checkSetupNeeded);
router.post('/initial', setupController.initialSetup);

module.exports = router;
