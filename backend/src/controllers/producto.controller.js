const { Producto, Categoria } = require('../models');

/**
 * Obtener todos los productos de un local
 */
exports.getByLocal = async (req, res) => {
  try {
    const { localId } = req.params;
    const { disponible } = req.query;

    const where = { localId, activo: true };
    if (disponible !== undefined) {
      where.disponible = disponible === 'true';
    }

    const productos = await Producto.findAll({
      where,
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['destacado', 'DESC'], ['nombre', 'ASC']]
    });

    res.json({ success: true, productos });

  } catch (error) {
    console.error('Error en getByLocal:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

/**
 * Obtener productos por categoría
 */
exports.getByCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const productos = await Producto.findAll({
      where: { categoriaId, activo: true, disponible: true },
      order: [['destacado', 'DESC'], ['nombre', 'ASC']]
    });

    res.json({ success: true, productos });

  } catch (error) {
    console.error('Error en getByCategoria:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

/**
 * Obtener producto por ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ success: true, producto });

  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

/**
 * Crear nuevo producto
 */
exports.create = async (req, res) => {
  try {
    const { 
      categoriaId, 
      nombre, 
      descripcion, 
      precio, 
      imagenBase64, 
      tiempoPreparacion,
      opciones,
      disponible,
      destacado
    } = req.body;
    const localId = req.user.localId;

    if (!categoriaId || !nombre || !precio) {
      return res.status(400).json({ error: 'Categoría, nombre y precio son requeridos' });
    }

    // Verificar que la categoría pertenece al local
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria || categoria.localId !== localId) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

    const producto = await Producto.create({
      localId,
      categoriaId,
      nombre,
      descripcion,
      precio,
      imagenBase64,
      tiempoPreparacion,
      opciones: opciones || [],
      disponible: disponible !== undefined ? disponible : true,
      destacado: destacado || false
    });

    // Recargar con categoría
    await producto.reload({
      include: [{ model: Categoria, as: 'categoria' }]
    });

    res.status(201).json({ success: true, producto });

  } catch (error) {
    console.error('Error en create:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

/**
 * Actualizar producto
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      categoriaId,
      nombre, 
      descripcion, 
      precio, 
      imagenBase64, 
      tiempoPreparacion,
      opciones,
      disponible,
      destacado,
      activo
    } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar que pertenece al mismo local
    if (producto.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await producto.update({
      categoriaId: categoriaId || producto.categoriaId,
      nombre: nombre || producto.nombre,
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      precio: precio !== undefined ? precio : producto.precio,
      imagenBase64: imagenBase64 !== undefined ? imagenBase64 : producto.imagenBase64,
      tiempoPreparacion: tiempoPreparacion !== undefined ? tiempoPreparacion : producto.tiempoPreparacion,
      opciones: opciones !== undefined ? opciones : producto.opciones,
      disponible: disponible !== undefined ? disponible : producto.disponible,
      destacado: destacado !== undefined ? destacado : producto.destacado,
      activo: activo !== undefined ? activo : producto.activo
    });

    // Recargar con categoría
    await producto.reload({
      include: [{ model: Categoria, as: 'categoria' }]
    });

    res.json({ success: true, producto });

  } catch (error) {
    console.error('Error en update:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

/**
 * Actualizar disponibilidad de producto (rápido)
 */
exports.updateDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await producto.update({ disponible });

    res.json({ success: true, producto });

  } catch (error) {
    console.error('Error en updateDisponibilidad:', error);
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
};

/**
 * Eliminar producto (soft delete)
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await producto.update({ activo: false });

    res.json({ success: true, message: 'Producto eliminado' });

  } catch (error) {
    console.error('Error en delete:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
