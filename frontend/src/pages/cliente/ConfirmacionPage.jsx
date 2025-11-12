import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Home, Bike, Wallet, CreditCard, DollarSign, Upload, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocal } from '../../context/LocalContext';
import { pedidoAPI, configuracionPagoAPI } from '../../services/api';
import DireccionAutocomplete from '../../components/cliente/DireccionAutocomplete';

const ConfirmacionPage = () => {
  const navigate = useNavigate();
  const { localId } = useParams();
  const { cart, getTotal, clearCart, clienteInfo } = useCart();
  const { local } = useLocal();

  const [formData, setFormData] = useState({
    clienteNombre: clienteInfo?.nombreCliente || '',
    clienteTelefono: clienteInfo?.telefonoCliente || '',
    tipoEntrega: clienteInfo?.tipoEntrega || 'mesa',
    numeroMesa: '',
    direccionEntrega: clienteInfo?.direccion || '',
    referenciaEntrega: clienteInfo?.referencia || '',
    notasCliente: '',
    metodoPago: 'efectivo'
  });
  const [loading, setLoading] = useState(false);
  const [recargoInfo, setRecargoInfo] = useState({
    porcentaje: 0,
    monto: 0,
    total: 0
  });
  const [comprobanteTransferencia, setComprobanteTransferencia] = useState(null);
  const [previewComprobante, setPreviewComprobante] = useState(null);

  useEffect(() => {
    if (cart.length === 0) {
      navigate(`/menu/${localId}`);
    }
  }, [cart, navigate, localId]);

  // Pre-llenar datos del cliente si existen
  useEffect(() => {
    if (clienteInfo) {
      setFormData(prev => ({
        ...prev,
        clienteNombre: clienteInfo.nombreCliente || prev.clienteNombre,
        clienteTelefono: clienteInfo.telefonoCliente || prev.clienteTelefono,
        tipoEntrega: clienteInfo.tipoEntrega || prev.tipoEntrega,
        direccionEntrega: clienteInfo.direccion || prev.direccionEntrega,
        referenciaEntrega: clienteInfo.referencia || prev.referenciaEntrega
      }));
    }
  }, [clienteInfo]);

  // Calcular recargo cuando cambia el método de pago
  useEffect(() => {
    const calcularRecargo = async () => {
      if (!local) return;

      try {
        const subtotal = getTotal();
        const response = await configuracionPagoAPI.calcularRecargo(local.id, {
          metodoPago: formData.metodoPago,
          subtotal
        });

        setRecargoInfo({
          porcentaje: response.data.porcentajeRecargo,
          monto: parseFloat(response.data.montoRecargo),
          total: parseFloat(response.data.total)
        });
      } catch (error) {
        console.error('Error al calcular recargo:', error);
        // Si hay error, usar subtotal sin recargo
        setRecargoInfo({
          porcentaje: 0,
          monto: 0,
          total: getTotal()
        });
      }
    };

    calcularRecargo();
  }, [formData.metodoPago, local, getTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprobanteTransferencia(reader.result);
      setPreviewComprobante(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeComprobante = () => {
    setComprobanteTransferencia(null);
    setPreviewComprobante(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clienteNombre.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    if (formData.tipoEntrega === 'mesa' && !formData.numeroMesa.trim()) {
      toast.error('Por favor ingresa el número de mesa');
      return;
    }

    if (formData.tipoEntrega === 'delivery' && !formData.direccionEntrega.trim()) {
      toast.error('Por favor ingresa la dirección de entrega');
      return;
    }

    if (formData.metodoPago === 'transferencia' && !comprobanteTransferencia) {
      toast.error('Por favor sube el comprobante de transferencia');
      return;
    }

    setLoading(true);

    try {
      // Preparar items del pedido
      const items = cart.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        personalizaciones: item.personalizaciones,
        notas: item.notas
      }));

      // Crear pedido
      const response = await pedidoAPI.create({
        localId: local.id,
        ...formData,
        total: recargoInfo.total,
        recargoMetodoPago: recargoInfo.porcentaje,
        montoRecargo: recargoInfo.monto,
        comprobanteTransferencia: comprobanteTransferencia || null,
        items
      });

      toast.success('¡Pedido confirmado!');
      clearCart();
      
      // Navegar a página de seguimiento
      navigate(`/menu/${localId}/pedido/${response.data.pedido.id}`);

    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error(error.response?.data?.error || 'Error al confirmar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!local) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Confirmar Pedido</h1>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.cantidad}x {item.producto.nombre}
                </span>
                <span className="font-medium">${parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${parseFloat(getTotal()).toFixed(2)}</span>
            </div>
            {recargoInfo.porcentaje > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Recargo {formData.metodoPago} ({recargoInfo.porcentaje}%)
                </span>
                <span className="font-medium text-orange-600">+${recargoInfo.monto.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">${recargoInfo.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tus Datos</h2>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Nombre *
            </label>
            <input
              type="text"
              name="clienteNombre"
              value={formData.clienteNombre}
              onChange={handleInputChange}
              placeholder="Tu nombre"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-1" />
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="clienteTelefono"
              value={formData.clienteTelefono}
              onChange={handleInputChange}
              placeholder="+54 9 11 1234-5678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Tipo de entrega */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Entrega *
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'mesa' }))}
                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'mesa'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <MapPin size={20} className="sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Mesa</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'llevar' }))}
                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'llevar'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Home size={20} className="sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Para Llevar</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'delivery' }))}
                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'delivery'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bike size={20} className="sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Delivery</span>
              </button>
            </div>
          </div>

          {/* Número de mesa (si aplica) */}
          {formData.tipoEntrega === 'mesa' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Mesa *
              </label>
              <input
                type="text"
                name="numeroMesa"
                value={formData.numeroMesa}
                onChange={handleInputChange}
                placeholder="Ej: 5"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* Dirección (si es delivery) */}
          {formData.tipoEntrega === 'delivery' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Entrega *
                </label>
                <DireccionAutocomplete
                  value={formData.direccionEntrega}
                  onChange={(value) => setFormData(prev => ({ ...prev, direccionEntrega: value }))}
                  placeholder="Buscar dirección en el mapa..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  name="referenciaEntrega"
                  value={formData.referenciaEntrega}
                  onChange={handleInputChange}
                  placeholder="Ej: Casa azul, timbre 3B"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Método de Pago */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Wallet size={18} className="inline mr-2" />
              Método de Pago *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'efectivo' }))}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center space-y-2 ${
                  formData.metodoPago === 'efectivo'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <DollarSign size={32} className={formData.metodoPago === 'efectivo' ? 'text-primary' : 'text-gray-600'} />
                <span className="font-medium">Efectivo</span>
                <span className="text-xs text-gray-500">Pago al recibir</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'transferencia' }))}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center space-y-2 ${
                  formData.metodoPago === 'transferencia'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Home size={32} className={formData.metodoPago === 'transferencia' ? 'text-primary' : 'text-gray-600'} />
                <span className="font-medium">Transferencia</span>
                <span className="text-xs text-gray-500">CBU/Alias</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, metodoPago: 'mercadopago' }))}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center space-y-2 ${
                  formData.metodoPago === 'mercadopago'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard size={32} className={formData.metodoPago === 'mercadopago' ? 'text-primary' : 'text-gray-600'} />
                <span className="font-medium">Mercado Pago</span>
                <span className="text-xs text-gray-500">Link de pago</span>
              </button>
            </div>
          </div>

          {/* Datos Bancarios para Transferencia */}
          {formData.metodoPago === 'transferencia' && local?.datosBancarios && Object.keys(local.datosBancarios).length > 0 && (
            <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" size={24} />
                Datos para Transferencia
              </h3>
              <div className="bg-white rounded-lg p-4 space-y-3">
                {local.datosBancarios.titular && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Titular:</span>
                    <span className="text-sm font-semibold text-gray-900">{local.datosBancarios.titular}</span>
                  </div>
                )}
                {local.datosBancarios.cbu && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">CBU:</span>
                    <span className="text-sm font-mono text-gray-900 select-all">{local.datosBancarios.cbu}</span>
                  </div>
                )}
                {local.datosBancarios.alias && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Alias:</span>
                    <span className="text-sm font-semibold text-gray-900 select-all">{local.datosBancarios.alias}</span>
                  </div>
                )}
                {local.datosBancarios.banco && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Banco:</span>
                    <span className="text-sm text-gray-900">{local.datosBancarios.banco}</span>
                  </div>
                )}
                {local.datosBancarios.tipoCuenta && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Tipo de Cuenta:</span>
                    <span className="text-sm text-gray-900">{local.datosBancarios.tipoCuenta}</span>
                  </div>
                )}
                {local.datosBancarios.cuit && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 font-medium">CUIT/CUIL:</span>
                    <span className="text-sm font-mono text-gray-900">{local.datosBancarios.cuit}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-3 text-center">
                💡 Realiza la transferencia y luego sube el comprobante abajo
              </p>
            </div>
          )}

          {/* Comprobante de Transferencia */}
          {formData.metodoPago === 'transferencia' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Upload size={18} className="inline mr-2" />
                Comprobante de Transferencia *
              </label>
              
              {!previewComprobante ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleComprobanteChange}
                    className="hidden"
                    id="comprobante-upload"
                  />
                  <label
                    htmlFor="comprobante-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload size={48} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Haz clic para subir el comprobante
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, PNG o PDF (máx. 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-primary rounded-lg p-4">
                  <button
                    type="button"
                    onClick={removeComprobante}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={previewComprobante}
                    alt="Comprobante"
                    className="w-full h-48 object-contain rounded"
                  />
                  <p className="text-sm text-green-600 text-center mt-2">
                    ✓ Comprobante cargado correctamente
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              name="notasCliente"
              value={formData.notasCliente}
              onChange={handleInputChange}
              placeholder="Alguna indicación especial..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/menu/${localId}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Volver al Menú
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmacionPage;
