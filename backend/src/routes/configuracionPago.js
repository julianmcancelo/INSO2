const express = require('express');
const router = express.Router();
const configuracionPagoController = require('../controllers/configuracionPagoController');
const { protect } = require('../middleware/auth');

// Rutas públicas (para clientes)
router.get('/:localId', configuracionPagoController.getByLocal);
router.post('/:localId/calcular-recargo', configuracionPagoController.calcularRecargo);

// Rutas protegidas (solo admin)
router.put('/:localId', protect, configuracionPagoController.update);

module.exports = router;
