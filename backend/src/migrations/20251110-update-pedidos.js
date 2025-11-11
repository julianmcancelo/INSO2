'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Agregar columna referenciaEntrega
    await queryInterface.addColumn('pedidos', 'referenciaEntrega', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Referencia de la dirección (ej: Casa azul, timbre 3B)'
    });

    // 2. Actualizar ENUM de tipoEntrega (de 'llevar' a 'takeaway')
    await queryInterface.sequelize.query(`
      ALTER TABLE pedidos 
      MODIFY COLUMN tipoEntrega ENUM('mesa', 'takeaway', 'delivery') 
      NOT NULL DEFAULT 'mesa'
    `);

    console.log('✅ Migración completada: referenciaEntrega agregada y tipoEntrega actualizado');
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir cambios
    await queryInterface.removeColumn('pedidos', 'referenciaEntrega');
    
    await queryInterface.sequelize.query(`
      ALTER TABLE pedidos 
      MODIFY COLUMN tipoEntrega ENUM('mesa', 'llevar', 'delivery') 
      NOT NULL DEFAULT 'mesa'
    `);
  }
};
