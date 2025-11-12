const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
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
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Nombre del producto'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada del producto'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio del producto'
  },
  imagenBase64: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: 'Imagen del producto en Base64'
  },
  tiempoPreparacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tiempo estimado de preparación en minutos'
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Si el producto está disponible para pedidos'
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si el producto es destacado/popular'
  },
  opciones: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Opciones de personalización (extras, tamaños, etc.)',
    get() {
      const value = this.getDataValue('opciones');
      // Asegurar que siempre sea un array
      if (!value) return [];
      if (Array.isArray(value)) return value;
      // Si es un objeto, intentar convertirlo
      if (typeof value === 'object') return [];
      return [];
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'productos',
  timestamps: true,
  indexes: [
    { fields: ['localId', 'categoriaId'] },
    { fields: ['disponible', 'activo'] }
  ]
});

module.exports = Producto;
