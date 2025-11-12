const rateLimit = require('express-rate-limit');

// Deshabilitar rate limiting en desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Rate limiter general para todas las rutas
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDevelopment ? 1000 : 100, // 1000 en dev, 100 en producción
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Saltar en desarrollo
});

/**
 * Rate limiter estricto para login y registro
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDevelopment ? 100 : 5, // 100 en dev, 5 en producción
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
  skip: () => isDevelopment, // Saltar en desarrollo
});

/**
 * Rate limiter para creación de recursos
 */
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDevelopment ? 500 : 50, // 500 en dev, 50 en producción
  message: 'Límite de creación alcanzado, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Saltar en desarrollo
});

/**
 * Rate limiter para APIs públicas (menú del cliente)
 */
const publicApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: isDevelopment ? 300 : 30, // 300 en dev, 30 en producción
  message: 'Demasiadas solicitudes, por favor intenta de nuevo en un momento.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment, // Saltar en desarrollo
});

module.exports = {
  generalLimiter,
  authLimiter,
  createLimiter,
  publicApiLimiter
};
