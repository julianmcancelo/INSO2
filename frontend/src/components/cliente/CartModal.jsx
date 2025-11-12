import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useLocal } from '../../context/LocalContext';
import { verificarHorarioActual } from '../../utils/horarios';

const CartModal = ({ isOpen }) => {
  const navigate = useNavigate();
  const { localId } = useParams();
  const { local } = useLocal();
  const { cart, closeCart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const localAbierto = local?.horarioAtencion ? verificarHorarioActual(local.horarioAtencion).abierto : true;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Verificar si el local está abierto
    if (!localAbierto) {
      toast.error('El local está cerrado en este momento. No se pueden realizar pedidos.', {
        position: 'top-center',
        autoClose: 5000,
      });
      return;
    }
    
    setIsCheckingOut(true);
    closeCart();
    navigate(`/menu/${localId}/confirmacion`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay - solo visible en desktop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity hidden md:block" onClick={closeCart}></div>

      {/* Modal - fullscreen en mobile, sidebar en desktop */}
      <div className="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto md:pl-10 md:max-w-full flex">
        <div className="w-full md:w-screen md:max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ShoppingBag className="mr-2" size={24} />
                  Tu Pedido
                </h2>
                <button
                  onClick={closeCart}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items del carrito */}
              <div className="mt-8">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.map((item, index) => (
                        <li key={index} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            {item.producto.imagenBase64 ? (
                              <img
                                src={item.producto.imagenBase64}
                                alt={item.producto.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ShoppingBag className="text-gray-400" size={32} />
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.producto.nombre}</h3>
                                <button
                                  onClick={() => removeFromCart(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                ${parseFloat(item.producto.precio).toFixed(2)} c/u
                              </p>

                              {/* Personalizaciones */}
                              {Object.keys(item.personalizaciones).length > 0 && (
                                <div className="mt-1">
                                  {Object.entries(item.personalizaciones).map(([tipo, opciones]) => (
                                    <div key={tipo} className="text-xs text-gray-600">
                                      {opciones.map(opt => opt.nombre).join(', ')}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Notas */}
                              {item.notas && (
                                <p className="mt-1 text-xs text-gray-500 italic">
                                  Nota: {item.notas}
                                </p>
                              )}
                            </div>

                            <div className="flex-1 flex items-end justify-between text-sm">
                              {/* Controles de cantidad */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(index, item.cantidad - 1)}
                                  className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="text-gray-700 w-8 text-center">
                                  {item.cantidad}
                                </span>
                                <button
                                  onClick={() => updateQuantity(index, item.cantidad + 1)}
                                  className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <p className="ml-4 text-gray-900 font-medium">
                                ${parseFloat(item.subtotal).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                {/* Alerta si está cerrado */}
                {!localAbierto && (
                  <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <Clock size={20} className="flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Local Cerrado</p>
                        <p className="text-xs mt-1">No se pueden realizar pedidos en este momento</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Total</p>
                  <p className="text-2xl">${parseFloat(getTotal()).toFixed(2)}</p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !localAbierto}
                  className={`w-full border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white focus:outline-none transition-all ${
                    !localAbierto 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:opacity-90 disabled:opacity-50'
                  }`}
                >
                  {!localAbierto ? '🔒 Local Cerrado' : (isCheckingOut ? 'Procesando...' : 'Confirmar Pedido')}
                </button>

                <button
                  onClick={clearCart}
                  className="mt-2 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Vaciar Carrito
                </button>

                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <button
                    onClick={closeCart}
                    className="text-primary hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
