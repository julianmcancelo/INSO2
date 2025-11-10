const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.get('/me', protect, authController.getMe);
router.post('/usuarios', protect, authorize('superadmin', 'admin'), authController.createUsuario);

module.exports = router;
