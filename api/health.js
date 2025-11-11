// Health check endpoint
const { sequelize } = require('../backend/src/config/database');

module.exports = async (req, res) => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Cartita API',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'Cartita API',
      database: 'disconnected',
      error: error.message
    });
  }
};
