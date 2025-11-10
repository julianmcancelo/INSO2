const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PedidoItem = sequelize.define('PedidoItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pedidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Cantidad de este producto'
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio unitario al momento del pedido'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Subtotal (cantidad * precioUnitario + extras)'
  },
  personalizaciones: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Personalizaciones elegidas (extras, sin cebolla, etc.)'
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas específicas de este item'
  }
}, {
  tableName: 'pedido_items',
  timestamps: true,
  indexes: [
    { fields: ['pedidoId'] },
    { fields: ['productoId'] }
  ]
});

module.exports = PedidoItem;
