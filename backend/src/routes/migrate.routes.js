const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Endpoint temporal para recrear tablas
// ⚠️ ELIMINAR EN PRODUCCIÓN
router.post('/recreate-tables', async (req, res) => {
  try {
    console.log('🔄 Iniciando recreación de tablas...');
    
    // Forzar la recreación de todas las tablas
    await sequelize.sync({ force: true });
    
    console.log('✅ Tablas recreadas exitosamente');
    
    res.json({
      success: true,
      message: 'Tablas recreadas exitosamente',
      tables: [
        'usuarios (con resetPasswordToken y resetPasswordExpires)',
        'locales',
        'categorias',
        'productos',
        'pedidos',
        'pedido_items',
        'solicitudes',
        'configuracion_global',
        'configuracion_pago',
        'invitaciones'
      ]
    });
  } catch (error) {
    console.error('❌ Error al recrear tablas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
