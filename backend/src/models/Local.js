const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Local = sequelize.define('Local', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del local'
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Identificador único para URL (ej: restaurante-buen-sabor)'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción del local'
  },
  logoBase64: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Logo en formato Base64'
  },
  colorPrimario: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#ef4444',
    comment: 'Color principal del tema (hex)'
  },
  colorSecundario: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#f59e0b',
    comment: 'Color secundario del tema (hex)'
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  horarioAtencion: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Horarios de atención del local'
  },
  configuracion: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Configuraciones personalizadas (acepta delivery, tiempo estimado, etc.)'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'locales',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['slug'] }
  ]
});

module.exports = Local;
