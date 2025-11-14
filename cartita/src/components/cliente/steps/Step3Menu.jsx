'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, ChevronLeft, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

export default function Step3Menu({ 
  local,
  pedidoData, 
  goToNextStep,
  goToPrevStep 
}) {
  const { cart, addToCart, updateQuantity, removeFromCart, getTotal, getTotalItems } = useCart();

  const handleContinue = () => {
    if (cart.length === 0) {
      toast.error('Agregá al menos un producto para continuar', {
        icon: '🛒',
        position: 'bottom-center'
      });
      return;
    }

    toast.success('¡Perfecto! Ahora elegí cómo pagar', {
      icon: '💳',
      position: 'bottom-center'
    });
    goToNextStep();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
          <ShoppingCart className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tu Pedido 🛍️
        </h2>
        <p className="text-gray-600 text-lg">
          Revisá y confirmá lo que elegiste
        </p>
      </div>

      {/* Resumen del Cliente */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 font-medium">👤 Cliente</p>
            <p className="text-gray-900 font-semibold">{pedidoData.nombreCliente}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">📱 WhatsApp</p>
            <p className="text-gray-900 font-semibold">{pedidoData.telefonoCliente}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600 font-medium">
              {pedidoData.tipoEntrega === 'takeaway' ? '📦 Retiro' : '🚚 Envío'}
            </p>
            <p className="text-gray-900 font-semibold">
              {pedidoData.tipoEntrega === 'takeaway' 
                ? 'Retiro en el local' 
                : pedidoData.direccion}
            </p>
          </div>
        </div>
      </div>

      {/* Carrito */}
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            Tu carrito está vacío
          </p>
          <p className="text-gray-500 text-sm">
            Volvé atrás para agregar productos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items del carrito */}
          <div className="bg-white border-2 border-gray-200 rounded-xl divide-y divide-gray-200">
            {cart.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  {/* Imagen */}
                  {item.producto.imagenBase64 && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={item.producto.imagenBase64}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {item.producto.nombre}
                      </h3>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Personalizaciones */}
                    {item.personalizaciones && Object.keys(item.personalizaciones).length > 0 && (
                      <div className="mb-2">
                        {Object.entries(item.personalizaciones).map(([tipo, opciones]) => (
                          <p key={tipo} className="text-xs text-gray-600">
                            + {opciones.map(opt => opt.nombre).join(', ')}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Notas */}
                    {item.notas && (
                      <p className="text-xs text-gray-500 italic mb-2">
                        💬 {item.notas}
                      </p>
                    )}

                    {/* Cantidad y Precio */}
                    <div className="flex items-center justify-between">
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(index, item.cantidad - 1)}
                          className="bg-white p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                          disabled={item.cantidad <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-gray-900 font-bold w-8 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.cantidad + 1)}
                          className="bg-white p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          ${parseFloat(item.producto.precio).toFixed(2)} c/u
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total del pedido</p>
                <p className="text-xs text-white/60 mt-1">
                  {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <p className="text-4xl font-bold">
                ${parseFloat(getTotal()).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={goToPrevStep}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={24} />
          Atrás
        </button>

        <button
          onClick={handleContinue}
          disabled={cart.length === 0}
          className="flex-[2] bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar al Pago
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Info */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800 flex items-start gap-2">
          <span className="text-lg flex-shrink-0">💡</span>
          <span>
            Podés modificar las cantidades o eliminar productos antes de continuar
          </span>
        </p>
      </div>
    </div>
  );
}
