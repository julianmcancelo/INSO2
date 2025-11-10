const { verifyToken } = require('../config/jwt');
const { Usuario } = require('../models');

/**
 * Middleware para proteger rutas que requieren autenticación
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extraer token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'No autorizado - Usuario no encontrado o inactivo' });
    }

    // Agregar usuario al request
    req.user = {
      id: usuario.id,
      localId: usuario.localId,
      rol: usuario.rol,
      email: usuario.email,
      nombre: usuario.nombre
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {...string} roles - Roles permitidos
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado - No tienes permisos suficientes' 
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
