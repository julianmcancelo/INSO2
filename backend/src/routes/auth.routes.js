const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter, createLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateRegister, validateId } = require('../middleware/validators');

// Rutas públicas con rate limiting estricto
router.post('/login', authLimiter, validateLogin, authController.login);

// Rutas protegidas
router.get('/me', protect, authController.getMe);

// Gestión de usuarios (solo superadmin)
router.get('/usuarios', protect, authorize('superadmin'), authController.getUsuarios);
router.post('/usuarios', protect, authorize('superadmin'), createLimiter, validateRegister, authController.createUsuario);
router.put('/usuarios/:id', protect, authorize('superadmin'), validateId, authController.updateUsuario);
router.delete('/usuarios/:id', protect, authorize('superadmin'), validateId, authController.deleteUsuario);

module.exports = router;
