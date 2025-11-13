'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocal } from '@/context/LocalContext';
import { pedidoAPI } from '@/lib/api';

export default function ConfirmacionPage() {
  const router = useRouter();
  const params = useParams();
  const { cart, getTotal, clearCart, clienteInfo } = useCart();
  const { local } = useLocal();

  const [formData, setFormData] = useState({
    nombreCliente: clienteInfo?.nombreCliente || '',
    telefonoCliente: clienteInfo?.telefonoCliente || '',
    tipoEntrega: clienteInfo?.tipoEntrega || 'takeaway',
    direccion: clienteInfo?.direccion || '',
    referencia: clienteInfo?.referencia || '',
    notas: '',
    metodoPago: 'efectivo'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      router.push(`/menu/${params.localId}`);
    }
  }, [cart, router, params.localId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombreCliente.trim() || !formData.telefonoCliente.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        localId: local.id,
        nombreCliente: formData.nombreCliente,
        telefonoCliente: formData.telefonoCliente,
        tipoEntrega: formData.tipoEntrega,
        direccion: formData.direccion,
        items: cart.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.subtotal,
          personalizaciones: item.personalizaciones,
          notas: item.notas
        })),
        total: getTotal(),
        notas: formData.notas
      };

      const response = await pedidoAPI.create(pedidoData);
      
      clearCart();
      toast.success('¡Pedido realizado exitosamente!');
      
      router.push(`/menu/${params.localId}/seguimiento/${response.data.pedido.id}`);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmar Pedido</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del cliente */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tus Datos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombreCliente"
                    value={formData.nombreCliente}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefonoCliente"
                    value={formData.telefonoCliente}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tipo de entrega */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'takeaway' }))}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.tipoEntrega === 'takeaway'
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <ShoppingBag className="mx-auto mb-2" size={24} />
                  <p className="font-medium">Take Away</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'delivery' }))}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.tipoEntrega === 'delivery'
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <MapPin className="mx-auto mb-2" size={24} />
                  <p className="font-medium">Delivery</p>
                </button>
              </div>
            </div>

            {/* Dirección (si es delivery) */}
            {formData.tipoEntrega === 'delivery' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Resumen del Pedido</h3>
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.cantidad}x {item.producto.nombre}</span>
                    <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de confirmar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
