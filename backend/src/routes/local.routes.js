const express = require('express');
const router = express.Router();
const localController = require('../controllers/local.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/slug/:slug', localController.getBySlug);

// Rutas protegidas
router.get('/', protect, authorize('superadmin'), localController.getAll);
router.get('/:id', localController.getById);
router.post('/', protect, authorize('superadmin'), localController.create);
router.post('/with-admin', protect, authorize('superadmin'), localController.createWithAdmin);
router.put('/:id', protect, authorize('admin', 'superadmin'), localController.update);
router.delete('/:id', protect, authorize('superadmin'), localController.delete);

module.exports = router;
