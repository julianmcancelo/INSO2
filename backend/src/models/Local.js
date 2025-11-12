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
    type: DataTypes.TEXT('long'),
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
    comment: 'Horarios de atención del local',
    get() {
      const value = this.getDataValue('horarioAtencion');
      // Si es string, parsearlo a objeto
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return {};
        }
      }
      return value || {};
    },
    set(value) {
      // Asegurar que se guarde como objeto, no como string
      this.setDataValue('horarioAtencion', value);
    }
  },
  datosBancarios: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Datos bancarios para transferencias (CBU, Alias, Titular, Banco)',
    get() {
      const value = this.getDataValue('datosBancarios');
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return {};
        }
      }
      return value || {};
    }
  },
  configuracion: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Configuración adicional del local',
    get() {
      const value = this.getDataValue('configuracion');
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return {};
        }
      }
      return value || {};
    }
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
