const { Local, Usuario } = require('../models');

/**
 * Obtener configuración de local por slug
 */
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const local = await Local.findOne({
      where: { slug, activo: true }
    });

    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    res.json({ success: true, local });

  } catch (error) {
    console.error('Error en getBySlug:', error);
    res.status(500).json({ error: 'Error al obtener local' });
  }
};

/**
 * Obtener local por ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const local = await Local.findByPk(id);

    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    res.json({ success: true, local });

  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ error: 'Error al obtener local' });
  }
};

/**
 * Crear nuevo local (solo superadmin)
 */
exports.create = async (req, res) => {
  try {
    const { 
      nombre, 
      slug, 
      descripcion, 
      logoBase64, 
      colorPrimario, 
      colorSecundario,
      direccion,
      telefono,
      email,
      horarioAtencion,
      configuracion
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !slug) {
      return res.status(400).json({ error: 'Nombre y slug son requeridos' });
    }

    // Validar slug único
    const existente = await Local.findOne({ where: { slug } });
    if (existente) {
      return res.status(400).json({ error: 'El slug ya está en uso' });
    }

    const local = await Local.create({
      nombre,
      slug,
      descripcion,
      logoBase64,
      colorPrimario,
      colorSecundario,
      direccion,
      telefono,
      email,
      horarioAtencion,
      configuracion
    });

    res.status(201).json({ success: true, local });

  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({ error: 'Error al crear local' });
  }
};

/**
 * Actualizar local
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      logoBase64, 
      colorPrimario, 
      colorSecundario,
      direccion,
      telefono,
      email,
      horarioAtencion,
      datosBancarios,
      configuracion,
      activo
    } = req.body;

    const local = await Local.findByPk(id);
    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    // Verificar que el usuario pertenece al local o es superadmin
    if (req.user.localId !== local.id && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await local.update({
      nombre: nombre || local.nombre,
      descripcion: descripcion !== undefined ? descripcion : local.descripcion,
      logoBase64: logoBase64 !== undefined ? logoBase64 : local.logoBase64,
      colorPrimario: colorPrimario || local.colorPrimario,
      colorSecundario: colorSecundario || local.colorSecundario,
      direccion: direccion !== undefined ? direccion : local.direccion,
      telefono: telefono !== undefined ? telefono : local.telefono,
      email: email !== undefined ? email : local.email,
      horarioAtencion: horarioAtencion || local.horarioAtencion,
      datosBancarios: datosBancarios !== undefined ? datosBancarios : local.datosBancarios,
      configuracion: configuracion || local.configuracion,
      activo: activo !== undefined ? activo : local.activo
    });

    res.json({ success: true, local });

  } catch (error) {
    console.error('Error en update:', error);
    res.status(500).json({ error: 'Error al actualizar local' });
  }
};

/**
 * Obtener todos los locales (solo superadmin)
 */
exports.getAll = async (req, res) => {
  try {
    const locales = await Local.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: Usuario,
        as: 'usuarios',
        where: { rol: 'admin' },
        required: false,
        attributes: ['id', 'nombre', 'email', 'activo']
      }]
    });

    res.json({ success: true, locales });

  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ error: 'Error al obtener locales' });
  }
};

/**
 * Crear local con administrador (solo superadmin)
 */
exports.createWithAdmin = async (req, res) => {
  try {
    const {
      // Datos del local
      nombre,
      slug,
      descripcion,
      colorPrimario,
      colorSecundario,
      direccion,
      telefono,
      email,
      // Datos del administrador
      nombreAdmin,
      emailAdmin,
      passwordAdmin
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !slug || !nombreAdmin || !emailAdmin || !passwordAdmin) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Validar slug único
    const slugExistente = await Local.findOne({ where: { slug } });
    if (slugExistente) {
      return res.status(400).json({ 
        error: 'El slug ya está en uso' 
      });
    }

    // Validar email único
    const emailExistente = await Usuario.findOne({ where: { email: emailAdmin } });
    if (emailExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear el local
    const local = await Local.create({
      nombre,
      slug,
      descripcion,
      logoBase64: req.body.logoBase64 || null,
      colorPrimario: colorPrimario || '#ef4444',
      colorSecundario: colorSecundario || '#f59e0b',
      direccion,
      telefono,
      email,
      activo: true
    });

    // Crear el administrador del local
    const admin = await Usuario.create({
      localId: local.id,
      nombre: nombreAdmin,
      email: emailAdmin,
      password: passwordAdmin,
      rol: 'admin',
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Local y administrador creados exitosamente',
      local: {
        id: local.id,
        nombre: local.nombre,
        slug: local.slug
      },
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error en createWithAdmin:', error);
    res.status(500).json({ 
      error: 'Error al crear local con administrador',
      details: error.message 
    });
  }
};

/**
 * Eliminar local (solo superadmin)
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const local = await Local.findByPk(id);
    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    await local.destroy();

    res.json({ 
      success: true, 
      message: 'Local eliminado exitosamente' 
    });

  } catch (error) {
    console.error('Error en delete:', error);
    res.status(500).json({ error: 'Error al eliminar local' });
  }
};
