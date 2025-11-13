const rateLimit = require('express-rate-limit');

/**
 * Rate limiter específico para endpoints de IA
 * Previene el abuso y protege contra errores 429 de DeepSeek
 */

// Rate limiter para generación de descripciones
const aiDescriptionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 solicitudes por minuto por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes de IA. Por favor, espera un minuto antes de intentar nuevamente.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Retornar info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`
  // Función para generar la key (por IP y usuario)
  keyGenerator: (req) => {
    return req.user?.id ? `user_${req.user.id}` : req.ip;
  },
  // Handler cuando se excede el límite
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Has excedido el límite de solicitudes de IA. Por favor, espera un minuto.',
      retryAfter: 60,
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Rate limiter para chatbot (más permisivo)
const aiChatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // Máximo 20 mensajes por minuto
  message: {
    success: false,
    message: 'Demasiados mensajes. Por favor, espera un momento.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip;
  }
});

// Rate limiter para análisis de tendencias (más restrictivo)
const aiAnalysisLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // Máximo 5 análisis cada 5 minutos
  message: {
    success: false,
    message: 'Límite de análisis alcanzado. Por favor, espera unos minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id ? `user_${req.user.id}` : req.ip;
  }
});

// Rate limiter general para todos los endpoints de IA
const aiGeneralLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // Máximo 30 solicitudes por minuto en total
  message: {
    success: false,
    message: 'Demasiadas solicitudes al servicio de IA. Por favor, espera un momento.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id ? `user_${req.user.id}` : req.ip;
  }
});

module.exports = {
  aiDescriptionLimiter,
  aiChatbotLimiter,
  aiAnalysisLimiter,
  aiGeneralLimiter
};
