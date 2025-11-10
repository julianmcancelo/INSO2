const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const Invitacion = sequelize.define('Invitacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    defaultValue: () => crypto.randomBytes(32).toString('hex')
  },
  localId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locales',
      key: 'id'
    },
    comment: 'Local al que pertenecerá el usuario'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Email al que se envió la invitación (opcional)'
  },
  rol: {
    type: DataTypes.ENUM('admin', 'staff'),
    allowNull: false,
    defaultValue: 'staff',
    comment: 'Rol que tendrá el usuario'
  },
  usado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si la invitación ya fue utilizada'
  },
  usadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'Usuario que utilizó la invitación'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Fecha de expiración del token'
  },
  creadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'Usuario que creó la invitación'
  }
}, {
  tableName: 'invitaciones',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['token'] },
    { fields: ['localId'] },
    { fields: ['usado'] },
    { fields: ['expiresAt'] }
  ]
});

module.exports = Invitacion;
