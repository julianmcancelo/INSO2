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

// Endpoint para verificar estructura de tablas
router.get('/verify-structure', async (req, res) => {
  try {
    // Query compatible con PostgreSQL (Neon) y MySQL
    const isPostgres = sequelize.getDialect() === 'postgres';
    
    const columnQuery = isPostgres 
      ? `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`
      : `SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, 
         IS_NULLABLE as is_nullable, COLUMN_DEFAULT as column_default
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
         ORDER BY ORDINAL_POSITION`;

    // Lista de todas las tablas a verificar
    const tables = [
      'usuarios',
      'locales', 
      'categorias',
      'productos',
      'pedidos',
      'pedido_items',
      'solicitudes',
      'configuracion_global',
      'configuracion_pagos',
      'invitaciones'
    ];

    const result = {};
    
    for (const table of tables) {
      const bindParam = isPostgres ? { bind: [table] } : { replacements: [table] };
      const [columns] = await sequelize.query(columnQuery, bindParam);
      result[table] = {
        exists: columns.length > 0,
        columnCount: columns.length,
        columns: columns.map(c => c.column_name)
      };
    }

    res.json({
      success: true,
      dialect: sequelize.getDialect(),
      tables: result
    });
  } catch (error) {
    console.error('❌ Error al verificar estructura:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
