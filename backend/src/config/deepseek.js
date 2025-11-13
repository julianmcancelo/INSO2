const axios = require('axios');

/**
 * Configuración de DeepSeek AI
 * API Documentation: https://platform.deepseek.com/api-docs
 */

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1';
    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    
    if (!this.apiKey) {
      console.warn('⚠️  DEEPSEEK_API_KEY no configurada. El servicio de IA estará deshabilitado.');
    }
  }

  /**
   * Verificar si el servicio está configurado
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Realizar una consulta a DeepSeek con manejo de rate limiting
   * @param {string} prompt - El prompt para la IA
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<string>} - Respuesta de la IA
   */
  async chat(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('DeepSeek API no está configurada. Configura DEEPSEEK_API_KEY en .env');
    }

    const maxRetries = options.maxRetries || 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: this.model,
            messages: [
              {
                role: 'system',
                content: options.systemPrompt || 'Eres un asistente útil para un restaurante.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            stream: false
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 segundos
          }
        );

        return response.data.choices[0].message.content;
      } catch (error) {
        lastError = error;
        
        // Error 429: Rate limit exceeded
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 5;
          const waitTime = parseInt(retryAfter) * 1000;
          
          console.warn(`⚠️  Rate limit alcanzado. Intento ${attempt}/${maxRetries}. Esperando ${retryAfter}s...`);
          
          // Si no es el último intento, esperar y reintentar
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // Último intento fallido
          throw {
            status: 429,
            message: 'Has alcanzado el límite de solicitudes de IA. Por favor, intenta nuevamente en unos minutos.',
            retryAfter: retryAfter
          };
        }
        
        // Error 401: API Key inválida
        if (error.response?.status === 401) {
          throw {
            status: 401,
            message: 'API Key de DeepSeek inválida. Verifica la configuración.'
          };
        }
        
        // Error 403: Acceso denegado
        if (error.response?.status === 403) {
          throw {
            status: 403,
            message: 'Acceso denegado a la API de DeepSeek. Verifica tu suscripción.'
          };
        }
        
        // Error 500: Error del servidor de DeepSeek
        if (error.response?.status >= 500) {
          console.error('Error del servidor de DeepSeek:', error.response?.data);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2s
            continue;
          }
          throw {
            status: 500,
            message: 'Error temporal del servicio de IA. Intenta nuevamente en unos momentos.'
          };
        }
        
        // Otros errores
        console.error('Error al consultar DeepSeek:', error.response?.data || error.message);
        throw {
          status: error.response?.status || 500,
          message: 'Error al procesar la solicitud de IA'
        };
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    throw lastError;
  }

  /**
   * Generar descripción de producto
   * @param {Object} producto - Datos del producto
   * @returns {Promise<string>} - Descripción generada
   */
  async generarDescripcionProducto(producto) {
    const prompt = `Genera una descripción atractiva y apetitosa para el siguiente producto de menú:

Nombre: ${producto.nombre}
Categoría: ${producto.categoria || 'No especificada'}
Precio: $${producto.precio}
${producto.ingredientes ? `Ingredientes: ${producto.ingredientes}` : ''}

La descripción debe ser:
- Breve (máximo 2-3 oraciones)
- Apetitosa y descriptiva
- En español
- Sin mencionar el precio`;

    return await this.chat(prompt, {
      systemPrompt: 'Eres un experto en gastronomía que escribe descripciones atractivas para menús de restaurantes.',
      temperature: 0.8,
      maxTokens: 150
    });
  }

  /**
   * Sugerir productos complementarios
   * @param {Object} producto - Producto principal
   * @param {Array} todosLosProductos - Lista de todos los productos disponibles
   * @returns {Promise<Array>} - Lista de productos sugeridos
   */
  async sugerirComplementos(producto, todosLosProductos) {
    const nombresProductos = todosLosProductos.map(p => p.nombre).join(', ');
    
    const prompt = `El cliente está pidiendo: ${producto.nombre}

Productos disponibles en el menú: ${nombresProductos}

Sugiere 3 productos que combinen bien con este pedido. Responde SOLO con los nombres de los productos separados por comas, sin explicaciones adicionales.`;

    const respuesta = await this.chat(prompt, {
      systemPrompt: 'Eres un experto en maridaje y combinaciones de alimentos.',
      temperature: 0.6,
      maxTokens: 100
    });

    // Parsear la respuesta y buscar los productos
    const sugerencias = respuesta.split(',').map(s => s.trim());
    return todosLosProductos.filter(p => 
      sugerencias.some(sug => p.nombre.toLowerCase().includes(sug.toLowerCase()))
    ).slice(0, 3);
  }

  /**
   * Responder preguntas sobre el menú
   * @param {string} pregunta - Pregunta del cliente
   * @param {Object} contexto - Información del local y menú
   * @returns {Promise<string>} - Respuesta de la IA
   */
  async responderPregunta(pregunta, contexto) {
    const prompt = `Pregunta del cliente: ${pregunta}

Información del restaurante:
- Nombre: ${contexto.nombreLocal}
- Productos disponibles: ${contexto.productos?.map(p => `${p.nombre} ($${p.precio})`).join(', ') || 'No disponible'}
- Horario: ${contexto.horario || 'No especificado'}

Responde de manera amigable y profesional. Si no tienes la información, indícalo claramente.`;

    return await this.chat(prompt, {
      systemPrompt: 'Eres un asistente virtual amigable de un restaurante. Ayudas a los clientes con información sobre el menú, precios y horarios.',
      temperature: 0.7,
      maxTokens: 300
    });
  }

  /**
   * Analizar tendencias de pedidos
   * @param {Array} pedidos - Historial de pedidos
   * @returns {Promise<Object>} - Análisis y recomendaciones
   */
  async analizarTendencias(pedidos) {
    const resumenPedidos = pedidos.map(p => ({
      productos: p.items?.map(i => i.nombre).join(', '),
      total: p.total,
      fecha: p.createdAt
    }));

    const prompt = `Analiza los siguientes pedidos y proporciona insights:

${JSON.stringify(resumenPedidos, null, 2)}

Proporciona:
1. Productos más populares
2. Tendencias de ventas
3. Recomendaciones para el menú
4. Horarios de mayor demanda

Responde en formato JSON con las claves: populares, tendencias, recomendaciones, horarios`;

    const respuesta = await this.chat(prompt, {
      systemPrompt: 'Eres un analista de datos especializado en restaurantes.',
      temperature: 0.5,
      maxTokens: 500
    });

    try {
      return JSON.parse(respuesta);
    } catch (error) {
      return { error: 'No se pudo parsear el análisis', respuesta };
    }
  }

  /**
   * Generar nombre creativo para un producto
   * @param {Object} ingredientes - Ingredientes del producto
   * @returns {Promise<string>} - Nombre sugerido
   */
  async generarNombreProducto(ingredientes) {
    const prompt = `Genera un nombre creativo y atractivo para un plato con estos ingredientes: ${ingredientes.join(', ')}

El nombre debe ser:
- Corto (máximo 4 palabras)
- Memorable
- Apetitoso
- En español

Responde SOLO con el nombre, sin explicaciones.`;

    return await this.chat(prompt, {
      systemPrompt: 'Eres un chef creativo experto en naming de platos.',
      temperature: 0.9,
      maxTokens: 50
    });
  }
}

// Exportar instancia singleton
const deepseekService = new DeepSeekService();

module.exports = deepseekService;
