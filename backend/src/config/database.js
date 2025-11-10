const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'menu_digital',
  username: process.env.DB_USER || 'menuadmin',
  password: process.env.DB_PASSWORD || 'menupass123',
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000
  }
});

module.exports = { sequelize };
