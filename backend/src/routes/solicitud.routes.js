const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud.controller');
const { protect, authorize } = require('../middleware/auth');

// Ruta pública - Landing page
router.post('/', solicitudController.create);

// Rutas protegidas - Solo superadmin
router.get('/', protect, authorize('superadmin'), solicitudController.getAll);
router.post('/:id/aprobar', protect, authorize('superadmin'), solicitudController.aprobar);
router.post('/:id/rechazar', protect, authorize('superadmin'), solicitudController.rechazar);
router.delete('/:id', protect, authorize('superadmin'), solicitudController.delete);

module.exports = router;
