const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConfiguracionGlobal = sequelize.define('ConfiguracionGlobal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clave: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Clave única de configuración (ej: mantenimiento_activo)'
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Valor de la configuración (JSON o string)'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción de para qué sirve esta configuración'
  },
  tipo: {
    type: DataTypes.ENUM('boolean', 'string', 'number', 'json', 'date'),
    allowNull: false,
    defaultValue: 'string',
    comment: 'Tipo de dato del valor'
  }
}, {
  tableName: 'configuracion_global',
  timestamps: true
});

module.exports = ConfiguracionGlobal;
