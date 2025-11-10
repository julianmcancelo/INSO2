const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Categoria = sequelize.define('Categoria', {
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
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre de la categoría (ej: Hamburguesas, Bebidas, Postres)'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  iconoBase64: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Icono de la categoría en Base64'
  },
  orden: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Orden de visualización'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categorias',
  timestamps: true,
  indexes: [
    { fields: ['localId', 'orden'] }
  ]
});

module.exports = Categoria;
