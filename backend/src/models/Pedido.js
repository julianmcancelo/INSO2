const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  localId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locales',
      key: 'id'
    }
  },
  numeroPedido: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Número único del pedido (ej: #001, #002)'
  },
  clienteNombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del cliente'
  },
  clienteTelefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tipoEntrega: {
    type: DataTypes.ENUM('mesa', 'takeaway', 'delivery'),
    allowNull: false,
    defaultValue: 'mesa',
    comment: 'Tipo de entrega del pedido'
  },
  numeroMesa: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Número de mesa (si aplica)'
  },
  direccionEntrega: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Dirección de entrega (si es delivery)'
  },
  referenciaEntrega: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Referencia de la dirección (ej: Casa azul, timbre 3B)'
  },
  metodoPago: {
    type: DataTypes.ENUM('efectivo', 'transferencia', 'mercadopago'),
    allowNull: false,
    defaultValue: 'efectivo',
    comment: 'Método de pago seleccionado'
  },
  recargoMetodoPago: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Porcentaje de recargo por método de pago'
  },
  montoRecargo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Monto del recargo aplicado'
  },
  comprobanteTransferencia: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'Imagen del comprobante de transferencia en Base64'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
    comment: 'Estado del pedido'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total del pedido'
  },
  notasCliente: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del cliente'
  },
  tiempoEstimado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tiempo estimado de preparación en minutos'
  },
  horaEntrega: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Hora estimada de entrega'
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['numeroPedido'] },
    { fields: ['localId', 'estado'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Pedido;
