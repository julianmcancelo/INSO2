const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect, authorize } = require('../middleware/auth');
const { 
  aiDescriptionLimiter, 
  aiChatbotLimiter, 
  aiAnalysisLimiter,
  aiGeneralLimiter 
} = require('../middleware/aiRateLimiter');

/**
 * Rutas para funcionalidades de IA con DeepSeek
 * Todas las rutas requieren autenticación
 */

// Verificar estado del servicio de IA
router.get('/estado', aiController.verificarEstado);

// Generar descripción de producto
// POST /api/ai/descripcion/:productoId (con ID de producto existente)
// POST /api/ai/descripcion (con datos en el body)
router.post('/descripcion/:productoId?', protect, aiDescriptionLimiter, aiController.generarDescripcion);

// Sugerir productos complementarios
// GET /api/ai/sugerencias/:productoId?localId=123
router.get('/sugerencias/:productoId', aiGeneralLimiter, aiController.sugerirComplementos);

// Chatbot - Responder preguntas sobre el menú
// POST /api/ai/chatbot
// Body: { pregunta: "¿Qué pizzas tienen?", localId: 123 }
router.post('/chatbot', aiChatbotLimiter, aiController.chatbot);

// Analizar tendencias de pedidos (solo admin/gerente)
// GET /api/ai/tendencias/:localId?dias=30
router.get(
  '/tendencias/:localId',
  protect,
  authorize('admin', 'gerente', 'superadmin'),
  aiAnalysisLimiter,
  aiController.analizarTendencias
);

// Generar nombre creativo para producto
// POST /api/ai/nombre
// Body: { ingredientes: ["pollo", "queso", "tomate"] }
router.post('/nombre', protect, aiDescriptionLimiter, aiController.generarNombre);

module.exports = router;
