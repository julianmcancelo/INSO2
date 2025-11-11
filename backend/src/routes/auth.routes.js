const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);

// Rutas protegidas
router.get('/me', protect, authController.getMe);

// Gestión de usuarios (solo superadmin)
router.get('/usuarios', protect, authorize('superadmin'), authController.getUsuarios);
router.post('/usuarios', protect, authorize('superadmin'), authController.createUsuario);
router.put('/usuarios/:id', protect, authorize('superadmin'), authController.updateUsuario);
router.delete('/usuarios/:id', protect, authorize('superadmin'), authController.deleteUsuario);

module.exports = router;
