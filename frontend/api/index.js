// Vercel Serverless Function - API Entry Point
const app = require('../../backend/src/server');

// Exportar como función serverless de Vercel
module.exports = (req, res) => {
  // Vercel maneja las rutas, pasamos la request a Express
  return app(req, res);
};
