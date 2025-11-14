'use client';

import { useState } from 'react';
import { Banknote, CreditCard, Upload, Check, ChevronLeft, Loader, Copy, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { pedidoAPI } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

export default function Step4MetodoPago({ 
  local,
  pedidoData, 
  updatePedidoData,
  goToPrevStep,
  onComplete 
}) {
  const router = useRouter();
  const params = useParams();
  const { cart, getTotal, clearCart } = useCart();
  
  const [metodoPago, setMetodoPago] = useState(pedidoData.metodoPago || null);
  const [comprobante, setComprobante] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(null);

  const handleMetodoPagoSelect = (metodo) => {
    setMetodoPago(metodo);
    updatePedidoData({ metodoPago: metodo });
  };

  const handleComprobanteChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es muy grande. Máximo 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprobante(reader.result);
      setComprobantePreview(reader.result);
      toast.success('Comprobante cargado correctamente', {
        icon: '✅',
        position: 'bottom-center'
      });
    };
    reader.readAsDataURL(file);
  };

  const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard.writeText(texto);
    setCopiado(tipo);
    toast.success('Copiado al portapapeles', {
      icon: '📋',
      position: 'bottom-center',
      autoClose: 2000
    });
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleFinalizarPedido = async () => {
    if (!metodoPago) {
      toast.error('Por favor seleccioná un método de pago');
      return;
    }

    if (metodoPago === 'transferencia' && !comprobante) {
      toast.error('Por favor cargá el comprobante de transferencia');
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        localId: local.id,
        nombreCliente: pedidoData.nombreCliente,
        telefonoCliente: pedidoData.telefonoCliente,
        tipoEntrega: pedidoData.tipoEntrega,
        direccion: pedidoData.direccion,
        latitud: pedidoData.latitud,
        longitud: pedidoData.longitud,
        referenciaDireccion: pedidoData.referenciaDireccion,
        items: cart.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.subtotal,
          personalizaciones: item.personalizaciones,
          notas: item.notas
        })),
        total: getTotal(),
        metodoPago: metodoPago,
        comprobanteBase64: comprobante,
        estadoPago: metodoPago === 'transferencia' ? 'pendiente' : 'confirmado'
      };

      const response = await pedidoAPI.create(pedidoData);
      
      clearCart();
      toast.success('¡Pedido realizado exitosamente!', {
        icon: '🎉',
        position: 'top-center',
        autoClose: 3000
      });
      
      // Redirigir a página de seguimiento
      router.push(`/menu/${params.localId}/seguimiento/${response.data.pedido.id}`);
      
      if (onComplete) {
        onComplete(response.data.pedido);
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-3 shadow-lg">
          <CreditCard className="text-white" size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Método de pago
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Elegí cómo vas a pagar tu pedido
        </p>
      </div>

      {/* Total a Pagar */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg text-center">
        <p className="text-white/80 text-sm font-medium mb-1">Total a pagar</p>
        <p className="text-5xl font-bold">${parseFloat(getTotal()).toFixed(2)}</p>
      </div>

      {/* Métodos de Pago */}
      <div className="space-y-3">
        {/* Efectivo */}
        {local.aceptaEfectivo && (
          <button
            onClick={() => handleMetodoPagoSelect('efectivo')}
            className={`w-full p-5 rounded-xl border-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              metodoPago === 'efectivo'
                ? 'border-black bg-black text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                metodoPago === 'efectivo' ? 'bg-white/20' : 'bg-green-100'
              }`}>
                <Banknote size={28} className={metodoPago === 'efectivo' ? 'text-white' : 'text-green-600'} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1">Efectivo</h3>
                <p className={`text-sm ${metodoPago === 'efectivo' ? 'text-white/80' : 'text-gray-600'}`}>
                  Pagás al recibir el pedido
                </p>
              </div>
              {metodoPago === 'efectivo' && (
                <CheckCircle2 size={28} className="text-white" />
              )}
            </div>
          </button>
        )}

        {/* Transferencia */}
        {local.aceptaTransferencia && (
          <button
            onClick={() => handleMetodoPagoSelect('transferencia')}
            className={`w-full p-5 rounded-xl border-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              metodoPago === 'transferencia'
                ? 'border-black bg-black text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                metodoPago === 'transferencia' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <CreditCard size={28} className={metodoPago === 'transferencia' ? 'text-white' : 'text-blue-600'} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1">Transferencia</h3>
                <p className={`text-sm ${metodoPago === 'transferencia' ? 'text-white/80' : 'text-gray-600'}`}>
                  Transferencia bancaria
                </p>
              </div>
              {metodoPago === 'transferencia' && (
                <CheckCircle2 size={28} className="text-white" />
              )}
            </div>
          </button>
        )}

        {/* MercadoPago - Próximamente */}
        <div className="relative">
          <button
            disabled
            className="w-full p-5 rounded-xl border-3 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200">
                <CreditCard size={28} className="text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold mb-1 text-gray-600">MercadoPago</h3>
                <p className="text-sm text-gray-500">
                  Tarjetas de crédito y débito
                </p>
              </div>
            </div>
          </button>
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            Próximamente
          </div>
        </div>
      </div>

          {/* Datos de Transferencia */}
      {metodoPago === 'transferencia' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 md:p-5">
            <h3 className="font-bold text-blue-900 mb-4 text-base md:text-lg">
              Datos para transferir
            </h3>
            
            <div className="space-y-3">
              {/* CBU/Alias */}
              {local.cbuAlias && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">Alias</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-gray-900">{local.cbuAlias}</p>
                    <button
                      onClick={() => copiarAlPortapapeles(local.cbuAlias, 'alias')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copiar"
                    >
                      {copiado === 'alias' ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* CBU Número */}
              {local.cbuNumero && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">CBU</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono font-bold text-gray-900">{local.cbuNumero}</p>
                    <button
                      onClick={() => copiarAlPortapapeles(local.cbuNumero, 'cbu')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copiar"
                    >
                      {copiado === 'cbu' ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Titular */}
              {local.titularCuenta && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">Titular</p>
                  <p className="text-sm font-semibold text-gray-900">{local.titularCuenta}</p>
                </div>
              )}

              {/* Banco */}
              {local.bancoNombre && (
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">Banco</p>
                  <p className="text-sm font-semibold text-gray-900">{local.bancoNombre}</p>
                </div>
              )}
            </div>
          </div>

          {/* Subir Comprobante */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">
              Comprobante de pago
            </h3>
            
            {!comprobantePreview ? (
              <label className="block cursor-pointer">
                <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black hover:bg-gray-50 transition-all">
                  <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium mb-1">
                    Subir comprobante
                  </p>
                  <p className="text-sm text-gray-500">
                    Foto o captura de pantalla (máx. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleComprobanteChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border-2 border-green-200">
                  <img
                    src={comprobantePreview}
                    alt="Comprobante"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Check size={16} />
                    Cargado
                  </div>
                </div>
                <button
                  onClick={() => {
                    setComprobante(null);
                    setComprobantePreview(null);
                  }}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cambiar comprobante
                </button>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 md:p-4">
            <p className="text-xs md:text-sm text-yellow-800">
              Tu pedido será confirmado una vez que verifiquemos el pago
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={goToPrevStep}
          disabled={loading}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ChevronLeft size={24} />
          Atrás
        </button>

        <button
          onClick={handleFinalizarPedido}
          disabled={loading || !metodoPago || (metodoPago === 'transferencia' && !comprobante)}
          className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={24} className="animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Check size={24} />
              Confirmar Pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
}
