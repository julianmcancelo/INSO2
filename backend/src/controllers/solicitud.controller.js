const { Solicitud, Local, Usuario } = require('../models');
const { enviarInvitacion, notificarNuevaSolicitud } = require('../config/email');
const { Invitacion } = require('../models');

/**
 * Crear nueva solicitud (Landing Page - Sin autenticación)
 */
exports.create = async (req, res) => {
  try {
    const {
      nombreNegocio,
      nombreContacto,
      email,
      telefono,
      tipoNegocio,
      mensaje
    } = req.body;

    // Validar campos requeridos
    if (!nombreNegocio || !nombreContacto || !email) {
      return res.status(400).json({
        error: 'Nombre del negocio, contacto y email son requeridos'
      });
    }

    // Verificar si ya existe una solicitud pendiente con este email
    const solicitudExistente = await Solicitud.findOne({
      where: { email, estado: 'pendiente' }
    });

    if (solicitudExistente) {
      return res.status(400).json({
        error: 'Ya existe una solicitud pendiente con este email'
      });
    }

    // Crear solicitud
    const solicitud = await Solicitud.create({
      nombreNegocio,
      nombreContacto,
      email,
      telefono,
      tipoNegocio,
      mensaje
    });

    // Notificar al superadmin (email del superadmin desde env)
    if (process.env.SUPERADMIN_EMAIL) {
      try {
        await notificarNuevaSolicitud(process.env.SUPERADMIN_EMAIL, solicitud);
      } catch (error) {
        console.error('Error al notificar superadmin:', error);
        // Continuar aunque falle la notificación
      }
    }

    res.status(201).json({
      success: true,
      message: 'Solicitud enviada exitosamente. Te contactaremos pronto.',
      solicitud: {
        id: solicitud.id,
        nombreNegocio: solicitud.nombreNegocio,
        email: solicitud.email
      }
    });

  } catch (error) {
    console.error('Error en create solicitud:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud',
      details: error.message
    });
  }
};

/**
 * Obtener todas las solicitudes (Superadmin)
 */
exports.getAll = async (req, res) => {
  try {
    const { estado } = req.query;

    const where = {};
    if (estado) {
      where.estado = estado;
    }

    const solicitudes = await Solicitud.findAll({
      where,
      include: [
        {
          model: Local,
          as: 'local',
          attributes: ['id', 'nombre', 'slug']
        },
        {
          model: Usuario,
          as: 'revisor',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, solicitudes });

  } catch (error) {
    console.error('Error en getAll solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

/**
 * Aprobar solicitud y crear local + invitación
 */
exports.aprobar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug,
      colorPrimario,
      colorSecundario,
      enviarEmail
    } = req.body;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({
        error: 'La solicitud ya fue procesada'
      });
    }

    // Crear el local
    const slugFinal = slug || solicitud.nombreNegocio
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const local = await Local.create({
      nombre: solicitud.nombreNegocio,
      slug: slugFinal,
      descripcion: `Local creado para ${solicitud.nombreNegocio}`,
      colorPrimario: colorPrimario || '#ef4444',
      colorSecundario: colorSecundario || '#f59e0b',
      telefono: solicitud.telefono,
      email: solicitud.email,
      activo: true
    });

    // Crear invitación
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitacion = await Invitacion.create({
      localId: local.id,
      email: solicitud.email,
      rol: 'admin',
      expiresAt,
      creadoPor: req.user.id
    });

    // Actualizar solicitud
    await solicitud.update({
      estado: 'aprobada',
      localCreado: local.id,
      revisadoPor: req.user.id,
      invitacionEnviada: !!enviarEmail
    });

    // Enviar email si se solicita
    if (enviarEmail) {
      try {
        await enviarInvitacion(
          solicitud.email,
          invitacion.token,
          local.nombre,
          solicitud.nombreContacto
        );
      } catch (error) {
        console.error('Error al enviar email:', error);
        return res.status(201).json({
          success: true,
          warning: 'Local creado pero el email no pudo enviarse',
          local,
          invitacion: {
            token: invitacion.token,
            url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register/${invitacion.token}`
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Solicitud aprobada y local creado',
      local,
      invitacion: {
        token: invitacion.token,
        url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register/${invitacion.token}`
      },
      emailEnviado: !!enviarEmail
    });

  } catch (error) {
    console.error('Error en aprobar solicitud:', error);
    res.status(500).json({
      error: 'Error al aprobar solicitud',
      details: error.message
    });
  }
};

/**
 * Rechazar solicitud
 */
exports.rechazar = async (req, res) => {
  try {
    const { id } = req.params;
    const { notas } = req.body;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({
        error: 'La solicitud ya fue procesada'
      });
    }

    await solicitud.update({
      estado: 'rechazada',
      revisadoPor: req.user.id,
      notas
    });

    res.json({
      success: true,
      message: 'Solicitud rechazada'
    });

  } catch (error) {
    console.error('Error en rechazar solicitud:', error);
    res.status(500).json({ error: 'Error al rechazar solicitud' });
  }
};

/**
 * Eliminar solicitud
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    await solicitud.destroy();

    res.json({
      success: true,
      message: 'Solicitud eliminada'
    });

  } catch (error) {
    console.error('Error en delete solicitud:', error);
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
};
