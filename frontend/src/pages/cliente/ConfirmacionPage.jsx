import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Home, Bike } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocal } from '../../context/LocalContext';
import { pedidoAPI } from '../../services/api';

const ConfirmacionPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { cart, getTotal, clearCart } = useCart();
  const { local } = useLocal();

  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteTelefono: '',
    tipoEntrega: 'mesa',
    numeroMesa: '',
    direccionEntrega: '',
    notasCliente: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate(`/${slug}`);
    }
  }, [cart, navigate, slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        items
      });

      toast.success('¡Pedido confirmado!');
      clearCart();
      
      // Navegar a página de seguimiento
      navigate(`/${slug}/pedido/${response.data.pedido.id}`);

    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error(error.response?.data?.error || 'Error al confirmar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!local) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Confirmar Pedido</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.cantidad}x {item.producto.nombre}
                </span>
                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">${getTotal().toFixed(2)}</span>
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
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'mesa' }))}
                className={`py-3 px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'mesa'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <MapPin size={24} className="mb-1" />
                <span className="text-sm font-medium">Mesa</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'llevar' }))}
                className={`py-3 px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'llevar'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Home size={24} className="mb-1" />
                <span className="text-sm font-medium">Para Llevar</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipoEntrega: 'delivery' }))}
                className={`py-3 px-4 rounded-lg border-2 transition flex flex-col items-center ${
                  formData.tipoEntrega === 'delivery'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bike size={24} className="mb-1" />
                <span className="text-sm font-medium">Delivery</span>
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Entrega *
              </label>
              <textarea
                name="direccionEntrega"
                value={formData.direccionEntrega}
                onChange={handleInputChange}
                placeholder="Calle, número, piso, departamento"
                rows={3}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
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
              onClick={() => navigate(`/${slug}`)}
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
