const { ConfiguracionPago } = require('../models');

// Obtener configuración de pago de un local
exports.getByLocal = async (req, res) => {
  try {
    const { localId } = req.params;

    let configuracion = await ConfiguracionPago.findOne({
      where: { localId }
    });

    // Si no existe, crear una por defecto
    if (!configuracion) {
      configuracion = await ConfiguracionPago.create({
        localId,
        recargoEfectivo: 0,
        recargoTransferencia: 0,
        recargoMercadoPago: 0
      });
    }

    res.json({ configuracion });
  } catch (error) {
    console.error('Error al obtener configuración de pago:', error);
    res.status(500).json({ 
      message: 'Error al obtener configuración de pago',
      error: error.message 
    });
  }
};

// Actualizar configuración de pago
exports.update = async (req, res) => {
  try {
    const { localId } = req.params;
    const {
      recargoEfectivo,
      recargoTransferencia,
      recargoMercadoPago,
      cbuTransferencia,
      aliasTransferencia,
      titularCuenta
    } = req.body;

    let configuracion = await ConfiguracionPago.findOne({
      where: { localId }
    });

    if (!configuracion) {
      // Crear si no existe
      configuracion = await ConfiguracionPago.create({
        localId,
        recargoEfectivo: recargoEfectivo || 0,
        recargoTransferencia: recargoTransferencia || 0,
        recargoMercadoPago: recargoMercadoPago || 0,
        cbuTransferencia,
        aliasTransferencia,
        titularCuenta
      });
    } else {
      // Actualizar
      await configuracion.update({
        recargoEfectivo: recargoEfectivo !== undefined ? recargoEfectivo : configuracion.recargoEfectivo,
        recargoTransferencia: recargoTransferencia !== undefined ? recargoTransferencia : configuracion.recargoTransferencia,
        recargoMercadoPago: recargoMercadoPago !== undefined ? recargoMercadoPago : configuracion.recargoMercadoPago,
        cbuTransferencia: cbuTransferencia !== undefined ? cbuTransferencia : configuracion.cbuTransferencia,
        aliasTransferencia: aliasTransferencia !== undefined ? aliasTransferencia : configuracion.aliasTransferencia,
        titularCuenta: titularCuenta !== undefined ? titularCuenta : configuracion.titularCuenta
      });
    }

    res.json({ 
      message: 'Configuración actualizada exitosamente',
      configuracion 
    });
  } catch (error) {
    console.error('Error al actualizar configuración de pago:', error);
    res.status(500).json({ 
      message: 'Error al actualizar configuración de pago',
      error: error.message 
    });
  }
};

// Calcular recargo según método de pago
exports.calcularRecargo = async (req, res) => {
  try {
    const { localId } = req.params;
    const { metodoPago, subtotal } = req.body;

    const configuracion = await ConfiguracionPago.findOne({
      where: { localId }
    });

    let porcentajeRecargo = 0;

    if (configuracion) {
      switch (metodoPago) {
        case 'efectivo':
          porcentajeRecargo = parseFloat(configuracion.recargoEfectivo) || 0;
          break;
        case 'transferencia':
          porcentajeRecargo = parseFloat(configuracion.recargoTransferencia) || 0;
          break;
        case 'mercadopago':
          porcentajeRecargo = parseFloat(configuracion.recargoMercadoPago) || 0;
          break;
        default:
          porcentajeRecargo = 0;
      }
    }

    const montoRecargo = (parseFloat(subtotal) * porcentajeRecargo) / 100;
    const total = parseFloat(subtotal) + montoRecargo;

    res.json({
      porcentajeRecargo,
      montoRecargo: montoRecargo.toFixed(2),
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Error al calcular recargo:', error);
    res.status(500).json({ 
      message: 'Error al calcular recargo',
      error: error.message 
    });
  }
};
