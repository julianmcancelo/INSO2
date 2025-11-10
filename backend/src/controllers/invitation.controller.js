const { Invitacion, Local, Usuario } = require('../models');
const { Op } = require('sequelize');

/**
 * Crear nueva invitación
 */
exports.create = async (req, res) => {
  try {
    const { localId, email, rol, diasExpiracion } = req.body;
    const userId = req.user.id;

    // Validar rol
    if (!['admin', 'staff'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // Verificar que el local existe
    const local = await Local.findByPk(localId);
    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    // Si no es superadmin, verificar que pertenece al local
    if (req.user.rol !== 'superadmin' && req.user.localId !== localId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Crear invitación
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (diasExpiracion || 7));

    const invitacion = await Invitacion.create({
      localId,
      email,
      rol,
      expiresAt,
      creadoPor: userId
    });

    res.status(201).json({
      success: true,
      invitacion: {
        id: invitacion.id,
        token: invitacion.token,
        localId: invitacion.localId,
        email: invitacion.email,
        rol: invitacion.rol,
        expiresAt: invitacion.expiresAt
      }
    });

  } catch (error) {
    console.error('Error en create invitación:', error);
    res.status(500).json({ error: 'Error al crear invitación' });
  }
};

/**
 * Obtener invitaciones de un local
 */
exports.getByLocal = async (req, res) => {
  try {
    const { localId } = req.params;

    // Si no es superadmin, verificar que pertenece al local
    if (req.user.rol !== 'superadmin' && req.user.localId !== parseInt(localId)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const invitaciones = await Invitacion.findAll({
      where: { localId },
      include: [
        {
          model: Usuario,
          as: 'creador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Usuario,
          as: 'usuarioRegistrado',
          attributes: ['id', 'nombre', 'email'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, invitaciones });

  } catch (error) {
    console.error('Error en getByLocal:', error);
    res.status(500).json({ error: 'Error al obtener invitaciones' });
  }
};

/**
 * Validar token de invitación
 */
exports.validateToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitacion = await Invitacion.findOne({
      where: { 
        token,
        usado: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: Local,
          as: 'local',
          attributes: ['id', 'nombre', 'slug', 'logoBase64', 'colorPrimario']
        }
      ]
    });

    if (!invitacion) {
      return res.status(404).json({ 
        error: 'Invitación inválida o expirada' 
      });
    }

    res.json({
      success: true,
      invitacion: {
        localId: invitacion.localId,
        local: invitacion.local,
        rol: invitacion.rol,
        email: invitacion.email
      }
    });

  } catch (error) {
    console.error('Error en validateToken:', error);
    res.status(500).json({ error: 'Error al validar token' });
  }
};

/**
 * Completar registro con invitación
 */
exports.completeRegistration = async (req, res) => {
  try {
    const { token } = req.params;
    const { nombre, email, password } = req.body;

    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Buscar invitación válida
    const invitacion = await Invitacion.findOne({
      where: { 
        token,
        usado: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!invitacion) {
      return res.status(404).json({ 
        error: 'Invitación inválida o expirada' 
      });
    }

    // Verificar que el email no esté en uso
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      localId: invitacion.localId,
      nombre,
      email,
      password,
      rol: invitacion.rol,
      activo: true
    });

    // Marcar invitación como usada
    await invitacion.update({
      usado: true,
      usadoPor: usuario.id
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en completeRegistration:', error);
    res.status(500).json({ 
      error: 'Error al completar registro',
      details: error.message 
    });
  }
};

/**
 * Eliminar invitación
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const invitacion = await Invitacion.findByPk(id);
    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    // Si no es superadmin, verificar que pertenece al local
    if (req.user.rol !== 'superadmin' && req.user.localId !== invitacion.localId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await invitacion.destroy();

    res.json({ success: true, message: 'Invitación eliminada' });

  } catch (error) {
    console.error('Error en delete:', error);
    res.status(500).json({ error: 'Error al eliminar invitación' });
  }
};
