const { Categoria, Producto } = require('../models');

/**
 * Obtener todas las categorías de un local
 */
exports.getByLocal = async (req, res) => {
  try {
    const { localId } = req.params;

    const categorias = await Categoria.findAll({
      where: { localId, activo: true },
      order: [['orden', 'ASC'], ['nombre', 'ASC']]
    });

    res.json({ success: true, categorias });

  } catch (error) {
    console.error('Error en getByLocal:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

/**
 * Obtener categoría con sus productos
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        {
          model: Producto,
          as: 'productos',
          where: { activo: true, disponible: true },
          required: false
        }
      ]
    });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ success: true, categoria });

  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

/**
 * Crear nueva categoría
 */
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, iconoBase64, orden } = req.body;
    const localId = req.user.localId;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const categoria = await Categoria.create({
      localId,
      nombre,
      descripcion,
      iconoBase64,
      orden: orden || 0
    });

    res.status(201).json({ success: true, categoria });

  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

/**
 * Actualizar categoría
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, iconoBase64, orden, activo } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Verificar que pertenece al mismo local
    if (categoria.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
      iconoBase64: iconoBase64 !== undefined ? iconoBase64 : categoria.iconoBase64,
      orden: orden !== undefined ? orden : categoria.orden,
      activo: activo !== undefined ? activo : categoria.activo
    });

    res.json({ success: true, categoria });

  } catch (error) {
    console.error('Error en update:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

/**
 * Eliminar categoría (soft delete)
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Verificar que pertenece al mismo local
    if (categoria.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await categoria.update({ activo: false });

    res.json({ success: true, message: 'Categoría eliminada' });

  } catch (error) {
    console.error('Error en delete:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
