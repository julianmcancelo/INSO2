const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas (clientes pueden crear pedidos)
router.post('/', pedidoController.create);
router.get('/:id', pedidoController.getById);

// Rutas protegidas para administradores
router.get('/local/:localId', protect, authorize('admin', 'staff', 'superadmin'), pedidoController.getByLocal);
router.put('/:id/estado', protect, authorize('admin', 'staff', 'superadmin'), pedidoController.updateEstado);
router.get('/local/:localId/estadisticas/hoy', protect, authorize('admin', 'staff', 'superadmin'), pedidoController.getEstadisticasHoy);

module.exports = router;
