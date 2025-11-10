const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitation.controller');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/validate/:token', invitationController.validateToken);
router.post('/register/:token', invitationController.completeRegistration);

// Rutas protegidas
router.post('/', protect, authorize('admin', 'superadmin'), invitationController.create);
router.get('/local/:localId', protect, authorize('admin', 'superadmin'), invitationController.getByLocal);
router.delete('/:id', protect, authorize('admin', 'superadmin'), invitationController.delete);

module.exports = router;
