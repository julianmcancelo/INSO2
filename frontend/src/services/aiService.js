import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Servicio para interactuar con la API de IA (DeepSeek)
 */

// Obtener token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Verificar estado del servicio de IA
 */
export const verificarEstadoIA = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/ai/estado`);
    return response.data;
  } catch (error) {
    console.error('Error al verificar estado de IA:', error);
    throw error;
  }
};

/**
 * Generar descripción de producto con IA
 */
export const generarDescripcion = async (productoData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/descripcion`,
      productoData,
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al generar descripción:', error);
    throw error;
  }
};

/**
 * Obtener sugerencias de productos complementarios
 */
export const obtenerSugerencias = async (productoId, localId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/ai/sugerencias/${productoId}?localId=${localId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener sugerencias:', error);
    throw error;
  }
};

/**
 * Chatbot - Responder pregunta sobre el menú
 */
export const preguntarChatbot = async (pregunta, localId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/chatbot`,
      { pregunta, localId },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error en chatbot:', error);
    throw error;
  }
};

/**
 * Analizar tendencias de pedidos (solo admin/gerente)
 */
export const analizarTendencias = async (localId, dias = 30) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/ai/tendencias/${localId}?dias=${dias}`,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al analizar tendencias:', error);
    throw error;
  }
};

/**
 * Generar nombre creativo para producto
 */
export const generarNombre = async (ingredientes) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/nombre`,
      { ingredientes },
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al generar nombre:', error);
    throw error;
  }
};

const aiService = {
  verificarEstadoIA,
  generarDescripcion,
  obtenerSugerencias,
  preguntarChatbot,
  analizarTendencias,
  generarNombre
};

export default aiService;
