import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// API de Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  createUsuario: (data) => api.post('/auth/usuarios', data)
};

// API de Locales
export const localAPI = {
  getBySlug: (slug) => api.get(`/locales/slug/${slug}`),
  getById: (id) => api.get(`/locales/${id}`),
  getAll: () => api.get('/locales'),
  create: (data) => api.post('/locales', data),
  createWithAdmin: (data) => api.post('/locales/with-admin', data),
  update: (id, data) => api.put(`/locales/${id}`, data),
  delete: (id) => api.delete(`/locales/${id}`)
};

// API de Categorías
export const categoriaAPI = {
  getByLocal: (localId) => api.get(`/categorias/local/${localId}`),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (data) => api.post('/categorias', data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`)
};

// API de Productos
export const productoAPI = {
  getByLocal: (localId, disponible) => {
    const params = disponible !== undefined ? { disponible } : {};
    return api.get(`/productos/local/${localId}`, { params });
  },
  getByCategoria: (categoriaId) => api.get(`/productos/categoria/${categoriaId}`),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  updateDisponibilidad: (id, disponible) => api.patch(`/productos/${id}/disponibilidad`, { disponible }),
  delete: (id) => api.delete(`/productos/${id}`)
};

// API de Pedidos
export const pedidoAPI = {
  create: (data) => api.post('/pedidos', data),
  getByLocal: (localId, params) => api.get(`/pedidos/local/${localId}`, { params }),
  getById: (id) => api.get(`/pedidos/${id}`),
  updateEstado: (id, estado) => api.put(`/pedidos/${id}/estado`, { estado }),
  getEstadisticasHoy: (localId) => api.get(`/pedidos/local/${localId}/estadisticas/hoy`)
};

// API de Invitaciones
export const invitationAPI = {
  create: (data) => api.post('/invitations', data),
  getByLocal: (localId) => api.get(`/invitations/local/${localId}`),
  validateToken: (token) => api.get(`/invitations/validate/${token}`),
  completeRegistration: (token, data) => api.post(`/invitations/register/${token}`, data),
  delete: (id) => api.delete(`/invitations/${id}`)
};

// API de Configuración de Pago
export const configuracionPagoAPI = {
  getByLocal: (localId) => api.get(`/configuracion-pago/${localId}`),
  calcularRecargo: (localId, data) => api.post(`/configuracion-pago/${localId}/calcular-recargo`, data),
  update: (localId, data) => api.put(`/configuracion-pago/${localId}`, data)
};

// API de Configuración Global
export const configuracionAPI = {
  getMantenimiento: () => api.get('/configuracion/mantenimiento'),
  getByKey: (clave) => api.get(`/configuracion/${clave}`),
  getAll: () => api.get('/configuracion'),
  update: (data) => api.put('/configuracion', data)
};

export default api;
