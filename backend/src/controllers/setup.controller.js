const { Usuario, Local } = require('../models');
const { generateToken } = require('../config/jwt');

/**
 * Verificar si el sistema necesita configuración inicial
 */
exports.checkSetupNeeded = async (req, res) => {
  try {
    const usuariosCount = await Usuario.count();
    const localesCount = await Local.count();

    res.json({
      success: true,
      setupNeeded: usuariosCount === 0 && localesCount === 0,
      hasUsers: usuariosCount > 0,
      hasLocales: localesCount > 0
    });
  } catch (error) {
    console.error('Error en checkSetupNeeded:', error);
    res.status(500).json({ error: 'Error al verificar estado del sistema' });
  }
};

/**
 * Crear configuración inicial (superadmin principal)
 */
exports.initialSetup = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password
    } = req.body;

    // Validar que no haya usuarios existentes
    const usuariosExistentes = await Usuario.count();
    if (usuariosExistentes > 0) {
      return res.status(400).json({ 
        error: 'El sistema ya ha sido configurado' 
      });
    }

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Validar email
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ 
        error: 'El email ya está en uso' 
      });
    }

    // Crear el superadministrador (sin local asociado)
    const usuario = await Usuario.create({
      localId: null,
      nombre,
      email,
      password,
      rol: 'superadmin',
      activo: true
    });

    // Generar token
    const token = generateToken({
      userId: usuario.id,
      localId: null,
      rol: usuario.rol
    });

    res.status(201).json({
      success: true,
      message: 'Sistema configurado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en initialSetup:', error);
    res.status(500).json({ 
      error: 'Error al configurar el sistema',
      details: error.message 
    });
  }
};
