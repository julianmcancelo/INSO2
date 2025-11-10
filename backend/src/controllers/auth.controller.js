const { Usuario, Local } = require('../models');
const { generateToken } = require('../config/jwt');

/**
 * Login de usuario administrador
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ 
      where: { email },
      include: [{ model: Local, as: 'local' }]
    });
    
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar que esté activo
    if (!usuario.activo) {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Generar token
    const token = generateToken({
      userId: usuario.id,
      localId: usuario.localId,
      rol: usuario.rol
    });

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        localId: usuario.localId,
        local: usuario.local
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

/**
 * Obtener datos del usuario autenticado
 */
exports.getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Local, as: 'local' }]
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, usuario });

  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};

/**
 * Crear nuevo usuario administrador (solo superadmin)
 */
exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, localId, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password || !localId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      localId,
      rol: rol || 'staff'
    });

    res.status(201).json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        localId: usuario.localId
      }
    });

  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};
