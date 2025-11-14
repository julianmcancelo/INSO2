'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, ChevronLeft, Package, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import ProductoCard from '../ProductoCard';
import CartModal from '../CartModal';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Step3Menu({ 
  local,
  pedidoData, 
  goToNextStep,
  goToPrevStep 
}) {
  const { cart, addToCart, updateQuantity, removeFromCart, getTotal, getTotalItems, isCartOpen } = useCart();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    loadProductos();
  }, [local.id]);

  const loadProductos = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const categoriasResponse = await axios.get(`${API_URL}/api/categorias/local/${local.id}`);
      setCategorias(categoriasResponse.data.categorias || []);

      // Cargar productos disponibles
      const productosResponse = await axios.get(`${API_URL}/api/productos/local/${local.id}?disponible=true`);
      setProductos(productosResponse.data.productos || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = !selectedCategoria || producto.categoriaId === selectedCategoria;
    
    return matchesSearch && matchesCategoria;
  });

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
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-3 shadow-lg">
          <ShoppingCart className="text-white" size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tu pedido
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Elegí tus productos y revisá tu pedido
        </p>
      </div>

      {/* Resumen del Cliente */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
          <div>
            <p className="text-gray-600 font-medium">Cliente</p>
            <p className="text-gray-900 font-semibold truncate">{pedidoData.nombreCliente}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">WhatsApp</p>
            <p className="text-gray-900 font-semibold">{pedidoData.telefonoCliente}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-600 font-medium">
              {pedidoData.tipoEntrega === 'takeaway' ? 'Retiro' : 'Envío'}
            </p>
            <p className="text-gray-900 font-semibold text-xs md:text-sm">
              {pedidoData.tipoEntrega === 'takeaway' 
                ? 'Retiro en el local' 
                : pedidoData.direccion}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador de productos */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
        />
      </div>

      {/* Filtro de categorías */}
      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategoria(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              !selectedCategoria
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategoria(categoria.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-1 ${
                selectedCategoria === categoria.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoria.icono && <span>{categoria.icono}</span>}
              {categoria.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Grid de productos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando productos...</p>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6">
          {filteredProductos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {/* Resumen del Carrito */}
      {cart.length === 0 ? (
        <div className="text-center py-8 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <ShoppingCart size={48} className="mx-auto text-yellow-600 mb-3" />
          <p className="text-yellow-800 font-medium">
            Agregá productos para continuar
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
                        Nota: {item.notas}
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
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 md:p-4">
        <p className="text-xs md:text-sm text-yellow-800">
          Podés modificar las cantidades o eliminar productos antes de continuar
        </p>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} />
    </div>
  );
}
