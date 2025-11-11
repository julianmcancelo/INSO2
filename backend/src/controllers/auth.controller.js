const { Usuario, Local } = require('../models');
const { generateToken } = require('../config/jwt');
const { logFailedLogin, logSuccessfulLogin, logUserCreation, logUserDeletion } = require('../utils/securityLogger');

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
    
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!usuario) {
      logFailedLogin(email, ip, 'Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      logFailedLogin(email, ip, 'Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar que esté activo
    if (!usuario.activo) {
      logFailedLogin(email, ip, 'Usuario inactivo');
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Generar token
    const token = generateToken({
      userId: usuario.id,
      localId: usuario.localId,
      rol: usuario.rol
    });

    // Log de login exitoso
    logSuccessfulLogin(usuario.id, email, ip);

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
 * Obtener todos los usuarios (solo superadmin)
 */
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Local, as: 'local' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, usuarios });

  } catch (error) {
    console.error('Error en getUsuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

/**
 * Crear nuevo usuario administrador (solo superadmin)
 */
exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, localId, rol, activo } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
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
      localId: localId || null,
      rol: rol || 'staff',
      activo: activo !== undefined ? activo : true
    });

    res.status(201).json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        localId: usuario.localId,
        activo: usuario.activo
      }
    });

  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

/**
 * Actualizar usuario (solo superadmin)
 */
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, localId, rol, activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el email ya existe en otro usuario
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (password) usuario.password = password; // El hook beforeUpdate lo hasheará
    if (localId !== undefined) usuario.localId = localId || null;
    if (rol) usuario.rol = rol;
    if (activo !== undefined) usuario.activo = activo;

    await usuario.save();

    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        localId: usuario.localId,
        activo: usuario.activo
      }
    });

  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

/**
 * Eliminar usuario (solo superadmin)
 */
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No permitir eliminar el propio usuario
    if (usuario.id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    await usuario.destroy();

    res.json({ success: true, message: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
