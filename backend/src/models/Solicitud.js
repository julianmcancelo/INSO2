const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreNegocio: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Nombre del negocio/marca'
  },
  nombreContacto: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Nombre de la persona de contacto'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    },
    comment: 'Email de contacto'
  },
  telefono: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Teléfono de contacto'
  },
  tipoNegocio: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Tipo de negocio (restaurante, cafetería, etc.)'
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mensaje adicional'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
    defaultValue: 'pendiente',
    comment: 'Estado de la solicitud'
  },
  localCreado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'locales',
      key: 'id'
    },
    comment: 'Local creado tras aprobar solicitud'
  },
  invitacionEnviada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si ya se envió la invitación por email'
  },
  revisadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'Superadmin que revisó la solicitud'
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del superadmin'
  }
}, {
  tableName: 'solicitudes',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['estado'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Solicitud;
