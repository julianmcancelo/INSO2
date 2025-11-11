const { Sequelize } = require('sequelize');

// Configuración de Sequelize
let sequelize;

// Si existe DATABASE_URL (Neon, Heroku, etc.), usarla
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necesario para Neon
      }
    }
  });
} else {
  // Configuración tradicional con variables individuales
  sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || (process.env.DB_DIALECT === 'postgres' ? 5432 : 3306),
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
    dialectOptions: process.env.DB_DIALECT === 'postgres' ? {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    } : {
      connectTimeout: 60000
    }
  });
}

module.exports = { sequelize };
