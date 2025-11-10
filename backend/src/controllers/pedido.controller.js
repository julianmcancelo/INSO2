const { Pedido, PedidoItem, Producto, Local } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Crear nuevo pedido
 */
exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { 
      localId,
      clienteNombre, 
      clienteTelefono, 
      tipoEntrega, 
      numeroMesa,
      direccionEntrega,
      items,
      notasCliente
    } = req.body;

    // Validar campos requeridos
    if (!localId || !clienteNombre || !tipoEntrega || !items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Generar número de pedido
    const ultimoPedido = await Pedido.findOne({
      where: { localId },
      order: [['createdAt', 'DESC']],
      transaction: t
    });

    let numeroSecuencial = 1;
    if (ultimoPedido && ultimoPedido.numeroPedido) {
      const match = ultimoPedido.numeroPedido.match(/#(\d+)/);
      if (match) {
        numeroSecuencial = parseInt(match[1]) + 1;
      }
    }

    const numeroPedido = `#${numeroSecuencial.toString().padStart(3, '0')}`;

    // Calcular total y tiempos
    let total = 0;
    let tiempoEstimadoTotal = 0;
    const itemsValidados = [];

    for (const item of items) {
      const producto = await Producto.findByPk(item.productoId, { transaction: t });
      
      if (!producto || !producto.disponible || producto.localId !== localId) {
        await t.rollback();
        return res.status(400).json({ 
          error: `Producto ${item.productoId} no disponible` 
        });
      }

      const precioUnitario = producto.precio;
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      if (producto.tiempoPreparacion) {
        tiempoEstimadoTotal = Math.max(tiempoEstimadoTotal, producto.tiempoPreparacion);
      }

      itemsValidados.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
        personalizaciones: item.personalizaciones || {},
        notas: item.notas || null
      });
    }

    // Crear pedido
    const pedido = await Pedido.create({
      localId,
      numeroPedido,
      clienteNombre,
      clienteTelefono,
      tipoEntrega,
      numeroMesa: tipoEntrega === 'mesa' ? numeroMesa : null,
      direccionEntrega: tipoEntrega === 'delivery' ? direccionEntrega : null,
      estado: 'pendiente',
      total,
      notasCliente,
      tiempoEstimado: tiempoEstimadoTotal || 15,
      horaEntrega: new Date(Date.now() + (tiempoEstimadoTotal || 15) * 60000)
    }, { transaction: t });

    // Crear items del pedido
    for (const item of itemsValidados) {
      await PedidoItem.create({
        pedidoId: pedido.id,
        ...item
      }, { transaction: t });
    }

    await t.commit();

    // Recargar pedido con relaciones
    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: [
        {
          model: PedidoItem,
          as: 'items',
          include: [{ model: Producto, as: 'producto' }]
        }
      ]
    });

    // Emitir evento de Socket.IO
    const io = req.app.get('io');
    io.to(`local-${localId}`).emit('nuevo-pedido', pedidoCompleto);

    res.status(201).json({ success: true, pedido: pedidoCompleto });

  } catch (error) {
    await t.rollback();
    console.error('Error en create:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

/**
 * Obtener pedidos por local
 */
exports.getByLocal = async (req, res) => {
  try {
    const { localId } = req.params;
    const { estado, fechaDesde, fechaHasta, limit } = req.query;

    const where = { localId };

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde && fechaHasta) {
      where.createdAt = {
        [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)]
      };
    }

    const pedidos = await Pedido.findAll({
      where,
      include: [
        {
          model: PedidoItem,
          as: 'items',
          include: [{ model: Producto, as: 'producto' }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit ? parseInt(limit) : undefined
    });

    res.json({ success: true, pedidos });

  } catch (error) {
    console.error('Error en getByLocal:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

/**
 * Obtener pedido por ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: PedidoItem,
          as: 'items',
          include: [{ model: Producto, as: 'producto' }]
        },
        {
          model: Local,
          as: 'local'
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ success: true, pedido });

  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

/**
 * Actualizar estado del pedido
 */
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: PedidoItem,
          as: 'items',
          include: [{ model: Producto, as: 'producto' }]
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que pertenece al mismo local
    if (pedido.localId !== req.user.localId && req.user.rol !== 'superadmin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await pedido.update({ estado });

    // Emitir evento de Socket.IO
    const io = req.app.get('io');
    io.to(`local-${pedido.localId}`).emit('pedido-actualizado', pedido);
    io.to(`pedido-${pedido.id}`).emit('estado-actualizado', { 
      pedidoId: pedido.id,
      estado: pedido.estado 
    });

    res.json({ success: true, pedido });

  } catch (error) {
    console.error('Error en updateEstado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

/**
 * Obtener estadísticas del día
 */
exports.getEstadisticasHoy = async (req, res) => {
  try {
    const { localId } = req.params;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const pedidosHoy = await Pedido.findAll({
      where: {
        localId,
        createdAt: {
          [Op.between]: [hoy, manana]
        }
      }
    });

    const estadisticas = {
      totalPedidos: pedidosHoy.length,
      pendientes: pedidosHoy.filter(p => p.estado === 'pendiente').length,
      preparando: pedidosHoy.filter(p => p.estado === 'preparando').length,
      listos: pedidosHoy.filter(p => p.estado === 'listo').length,
      entregados: pedidosHoy.filter(p => p.estado === 'entregado').length,
      cancelados: pedidosHoy.filter(p => p.estado === 'cancelado').length,
      totalVentas: pedidosHoy
        .filter(p => p.estado !== 'cancelado')
        .reduce((sum, p) => sum + parseFloat(p.total), 0)
    };

    res.json({ success: true, estadisticas });

  } catch (error) {
    console.error('Error en getEstadisticasHoy:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
