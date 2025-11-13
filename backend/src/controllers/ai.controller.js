const deepseekService = require('../config/deepseek');
const { Producto, Local } = require('../models');

/**
 * Controlador para funcionalidades de IA con DeepSeek
 */

/**
 * Generar descripción para un producto
 */
exports.generarDescripcion = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { nombre, categoria, precio, ingredientes } = req.body;

    // Verificar si DeepSeek está configurado
    if (!deepseekService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de IA no está configurado. Contacta al administrador.'
      });
    }

    // Si se proporciona productoId, buscar el producto
    let productoData;
    if (productoId) {
      const producto = await Producto.findByPk(productoId);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      productoData = {
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        ingredientes: producto.ingredientes
      };
    } else {
      // Usar datos del body
      productoData = { nombre, categoria, precio, ingredientes };
    }

    // Generar descripción
    const descripcion = await deepseekService.generarDescripcionProducto(productoData);

    res.json({
      success: true,
      data: {
        descripcion,
        producto: productoData
      }
    });
  } catch (error) {
    console.error('Error al generar descripción:', error);
    
    // Manejo específico de error 429 (Rate Limit)
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfter: error.retryAfter,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    // Manejo de otros errores específicos
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: 'AI_SERVICE_ERROR'
      });
    }
    
    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Error al generar descripción con IA',
      error: error.message
    });
  }
};

/**
 * Sugerir productos complementarios
 */
exports.sugerirComplementos = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { localId } = req.query;

    if (!deepseekService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de IA no está configurado'
      });
    }

    // Buscar el producto
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Obtener todos los productos del local
    const todosLosProductos = await Producto.findAll({
      where: { localId: localId || producto.localId, disponible: true },
      attributes: ['id', 'nombre', 'precio', 'categoria']
    });

    // Generar sugerencias
    const sugerencias = await deepseekService.sugerirComplementos(
      producto,
      todosLosProductos
    );

    res.json({
      success: true,
      data: {
        producto: {
          id: producto.id,
          nombre: producto.nombre
        },
        sugerencias
      }
    });
  } catch (error) {
    console.error('Error al sugerir complementos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar sugerencias',
      error: error.message
    });
  }
};

/**
 * Chatbot - Responder preguntas sobre el menú
 */
exports.chatbot = async (req, res) => {
  try {
    const { pregunta, localId } = req.body;

    if (!deepseekService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de IA no está configurado'
      });
    }

    if (!pregunta) {
      return res.status(400).json({
        success: false,
        message: 'La pregunta es requerida'
      });
    }

    // Obtener información del local
    const local = await Local.findByPk(localId, {
      include: [{
        model: Producto,
        as: 'productos',
        where: { disponible: true },
        required: false,
        attributes: ['nombre', 'precio', 'descripcion']
      }]
    });

    if (!local) {
      return res.status(404).json({
        success: false,
        message: 'Local no encontrado'
      });
    }

    // Preparar contexto
    const contexto = {
      nombreLocal: local.nombre,
      productos: local.productos,
      horario: local.horario || 'Consultar con el local'
    };

    // Obtener respuesta de la IA
    const respuesta = await deepseekService.responderPregunta(pregunta, contexto);

    res.json({
      success: true,
      data: {
        pregunta,
        respuesta,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error en chatbot:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la pregunta',
      error: error.message
    });
  }
};

/**
 * Analizar tendencias de pedidos
 */
exports.analizarTendencias = async (req, res) => {
  try {
    const { localId } = req.params;
    const { dias = 30 } = req.query;

    if (!deepseekService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de IA no está configurado'
      });
    }

    // Obtener pedidos recientes
    const { Pedido, DetallePedido } = require('../models');
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - parseInt(dias));

    const pedidos = await Pedido.findAll({
      where: {
        localId,
        createdAt: {
          [require('sequelize').Op.gte]: fechaInicio
        }
      },
      include: [{
        model: DetallePedido,
        as: 'items',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['nombre']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    if (pedidos.length === 0) {
      return res.json({
        success: true,
        message: 'No hay suficientes datos para analizar',
        data: null
      });
    }

    // Analizar con IA
    const analisis = await deepseekService.analizarTendencias(pedidos);

    res.json({
      success: true,
      data: {
        periodo: `Últimos ${dias} días`,
        totalPedidos: pedidos.length,
        analisis
      }
    });
  } catch (error) {
    console.error('Error al analizar tendencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al analizar tendencias',
      error: error.message
    });
  }
};

/**
 * Generar nombre creativo para producto
 */
exports.generarNombre = async (req, res) => {
  try {
    const { ingredientes } = req.body;

    if (!deepseekService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de IA no está configurado'
      });
    }

    if (!ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de ingredientes'
      });
    }

    const nombre = await deepseekService.generarNombreProducto(ingredientes);

    res.json({
      success: true,
      data: {
        nombre,
        ingredientes
      }
    });
  } catch (error) {
    console.error('Error al generar nombre:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar nombre',
      error: error.message
    });
  }
};

/**
 * Verificar estado del servicio de IA
 */
exports.verificarEstado = async (req, res) => {
  try {
    const configurado = deepseekService.isConfigured();
    
    res.json({
      success: true,
      data: {
        configurado,
        modelo: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        mensaje: configurado 
          ? 'Servicio de IA activo y funcionando' 
          : 'Servicio de IA no configurado. Agrega DEEPSEEK_API_KEY al archivo .env'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar estado',
      error: error.message
    });
  }
};
