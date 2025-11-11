const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Solicitar recuperación de contraseña
router.post('/forgot', passwordController.solicitarRecuperacion);

// Verificar si un token es válido
router.get('/verify/:token', passwordController.verificarToken);

// Resetear contraseña con token
router.post('/reset/:token', passwordController.resetearPassword);

// Resetear contraseña directamente con email
router.post('/reset-by-email', passwordController.resetearPasswordPorEmail);

module.exports = router;
