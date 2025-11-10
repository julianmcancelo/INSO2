const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas (para que clientes vean productos)
router.get('/local/:localId', productoController.getByLocal);
router.get('/categoria/:categoriaId', productoController.getByCategoria);
router.get('/:id', productoController.getById);

// Rutas protegidas para administradores
router.post('/', protect, authorize('admin', 'staff', 'superadmin'), productoController.create);
router.put('/:id', protect, authorize('admin', 'staff', 'superadmin'), productoController.update);
router.patch('/:id/disponibilidad', protect, authorize('admin', 'staff', 'superadmin'), productoController.updateDisponibilidad);
router.delete('/:id', protect, authorize('admin', 'superadmin'), productoController.delete);

module.exports = router;
