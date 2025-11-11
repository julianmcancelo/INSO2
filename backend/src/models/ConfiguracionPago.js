const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConfiguracionPago = sequelize.define('ConfiguracionPago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  localId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'locales',
      key: 'id'
    }
  },
  recargoEfectivo: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Porcentaje de recargo para pago en efectivo'
  },
  recargoTransferencia: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Porcentaje de recargo para transferencia'
  },
  recargoMercadoPago: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Porcentaje de recargo para Mercado Pago'
  },
  cbuTransferencia: {
    type: DataTypes.STRING(22),
    allowNull: true,
    comment: 'CBU para transferencias'
  },
  aliasTransferencia: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Alias para transferencias'
  },
  titularCuenta: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Titular de la cuenta bancaria'
  }
}, {
  tableName: 'configuracion_pagos',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['localId'] }
  ]
});

module.exports = ConfiguracionPago;
