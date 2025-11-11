const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracion.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/mantenimiento', configuracionController.getMantenimiento);
router.get('/:clave', configuracionController.getByKey);

// Rutas protegidas - solo superadmin
router.get('/', protect, authorize('superadmin'), configuracionController.getAll);
router.put('/', protect, authorize('superadmin'), configuracionController.update);

module.exports = router;
