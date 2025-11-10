const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas (para que clientes vean categorías)
router.get('/local/:localId', categoriaController.getByLocal);
router.get('/:id', categoriaController.getById);

// Rutas protegidas para administradores
router.post('/', protect, authorize('admin', 'superadmin'), categoriaController.create);
router.put('/:id', protect, authorize('admin', 'superadmin'), categoriaController.update);
router.delete('/:id', protect, authorize('admin', 'superadmin'), categoriaController.delete);

module.exports = router;
