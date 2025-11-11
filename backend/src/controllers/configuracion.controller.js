const { ConfiguracionGlobal } = require('../models');

// Obtener configuración por clave (público para verificar mantenimiento)
exports.getByKey = async (req, res) => {
  try {
    const { clave } = req.params;
    
    const config = await ConfiguracionGlobal.findOne({
      where: { clave }
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Configuración no encontrada'
      });
    }

    // Parsear el valor según el tipo
    let valorParseado = config.valor;
    if (config.tipo === 'boolean') {
      valorParseado = config.valor === 'true';
    } else if (config.tipo === 'number') {
      valorParseado = parseFloat(config.valor);
    } else if (config.tipo === 'json') {
      try {
        valorParseado = JSON.parse(config.valor);
      } catch (e) {
        valorParseado = config.valor;
      }
    }

    res.json({
      success: true,
      configuracion: {
        clave: config.clave,
        valor: valorParseado,
        tipo: config.tipo,
        descripcion: config.descripcion
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuración'
    });
  }
};

// Obtener todas las configuraciones (solo superadmin)
exports.getAll = async (req, res) => {
  try {
    const configuraciones = await ConfiguracionGlobal.findAll({
      order: [['clave', 'ASC']]
    });

    const configuracionesParseadas = configuraciones.map(config => {
      let valorParseado = config.valor;
      if (config.tipo === 'boolean') {
        valorParseado = config.valor === 'true';
      } else if (config.tipo === 'number') {
        valorParseado = parseFloat(config.valor);
      } else if (config.tipo === 'json') {
        try {
          valorParseado = JSON.parse(config.valor);
        } catch (e) {
          valorParseado = config.valor;
        }
      }

      return {
        id: config.id,
        clave: config.clave,
        valor: valorParseado,
        tipo: config.tipo,
        descripcion: config.descripcion,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt
      };
    });

    res.json({
      success: true,
      configuraciones: configuracionesParseadas
    });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuraciones'
    });
  }
};

// Actualizar o crear configuración (solo superadmin)
exports.update = async (req, res) => {
  try {
    const { clave, valor, descripcion, tipo } = req.body;

    if (!clave) {
      return res.status(400).json({
        success: false,
        error: 'La clave es requerida'
      });
    }

    // Convertir el valor a string según el tipo
    let valorString = valor;
    if (tipo === 'boolean') {
      valorString = valor ? 'true' : 'false';
    } else if (tipo === 'number') {
      valorString = valor.toString();
    } else if (tipo === 'json') {
      valorString = typeof valor === 'string' ? valor : JSON.stringify(valor);
    }

    // Buscar o crear
    const [config, created] = await ConfiguracionGlobal.findOrCreate({
      where: { clave },
      defaults: {
        valor: valorString,
        descripcion: descripcion || '',
        tipo: tipo || 'string'
      }
    });

    // Si ya existía, actualizar
    if (!created) {
      await config.update({
        valor: valorString,
        descripcion: descripcion || config.descripcion,
        tipo: tipo || config.tipo
      });
    }

    res.json({
      success: true,
      mensaje: created ? 'Configuración creada' : 'Configuración actualizada',
      configuracion: {
        clave: config.clave,
        valor: valor,
        tipo: config.tipo,
        descripcion: config.descripcion
      }
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar configuración'
    });
  }
};

// Endpoint específico para mantenimiento
exports.getMantenimiento = async (req, res) => {
  try {
    const mantenimientoActivo = await ConfiguracionGlobal.findOne({
      where: { clave: 'mantenimiento_activo' }
    });

    const fechaLanzamiento = await ConfiguracionGlobal.findOne({
      where: { clave: 'fecha_lanzamiento' }
    });

    const mensajeMantenimiento = await ConfiguracionGlobal.findOne({
      where: { clave: 'mensaje_mantenimiento' }
    });

    res.json({
      success: true,
      mantenimiento: {
        activo: mantenimientoActivo ? mantenimientoActivo.valor === 'true' : false,
        fechaLanzamiento: fechaLanzamiento ? fechaLanzamiento.valor : null,
        mensaje: mensajeMantenimiento ? mensajeMantenimiento.valor : 'Estamos trabajando en mejoras'
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración de mantenimiento:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener configuración de mantenimiento'
    });
  }
};
