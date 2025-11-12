import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocal } from '../../context/LocalContext';
import { useCart } from '../../context/CartContext';
import { localAPI, categoriaAPI, productoAPI } from '../../services/api';
import ProductoCard from '../../components/cliente/ProductoCard';
import CartModal from '../../components/cliente/CartModal';
import BienvenidaModal from '../../components/cliente/BienvenidaModal';
import HorarioStatus from '../../components/cliente/HorarioStatus';
import LoadingSpinner from '../../components/LoadingSpinner';

const MenuPage = () => {
  const { localId } = useParams();
  const { local, setLocal, loading: localLoading, setLoading: setLocalLoading } = useLocal();
  const { getTotalItems, openCart, isCartOpen, clienteInfo, setClienteData } = useCart();
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBienvenida, setShowBienvenida] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setLocalLoading(true);

      // Cargar local por ID
      const localResponse = await localAPI.getById(localId);
      setLocal(localResponse.data.local);

      // Cargar categorías
      const categoriasResponse = await categoriaAPI.getByLocal(localResponse.data.local.id);
      setCategorias(categoriasResponse.data.categorias);

      // Cargar productos
      const productosResponse = await productoAPI.getByLocal(localResponse.data.local.id, true);
      setProductos(productosResponse.data.productos);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar el menú');
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  }, [localId, setLocal, setLocalLoading]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    // Mostrar modal de bienvenida si no hay datos del cliente
    if (local && !clienteInfo) {
      setShowBienvenida(true);
    }
  }, [local, clienteInfo]);

  const handleBienvenidaComplete = (data) => {
    setClienteData(data);
    setShowBienvenida(false);
    toast.success(`¡Hola ${data.nombreCliente}! Bienvenido a ${local.nombre}`);
  };

  const productosFiltrados = productos.filter(p => {
    const matchCategoria = !categoriaSeleccionada || p.categoriaId === categoriaSeleccionada;
    const matchSearch = !searchTerm || 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  const productosPorCategoria = categorias.map(cat => ({
    ...cat,
    productos: productosFiltrados.filter(p => p.categoriaId === cat.id)
  })).filter(cat => cat.productos.length > 0);

  if (localLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!local) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Local no encontrado</h2>
          <p className="text-gray-600">El local con ID "{localId}" no existe</p>
        </div>
      </div>
    );
  }

  // Si no hay datos del cliente, solo mostrar el modal de bienvenida
  if (!clienteInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex items-center justify-center">
        {showBienvenida && local && (
          <BienvenidaModal 
            local={local} 
            onComplete={handleBienvenidaComplete} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {local.logoBase64 && (
                <img 
                  src={local.logoBase64} 
                  alt={local.nombre}
                  className="h-12 w-12 object-contain rounded"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{local.nombre}</h1>
                {local.descripcion && (
                  <p className="text-sm text-gray-600">{local.descripcion}</p>
                )}
              </div>
            </div>

            <button
              onClick={openCart}
              className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filtro de categorías */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[140px] z-30 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-3 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-medium shadow-md ${
                !categoriaSeleccionada
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-medium shadow-md ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <main className="container mx-auto px-4 py-8">
        {/* Estado de horarios */}
        {local.horarioAtencion && Object.keys(local.horarioAtencion).length > 0 && (
          <div className="mb-6">
            <HorarioStatus horarioAtencion={local.horarioAtencion} />
          </div>
        )}

        {productosPorCategoria.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 text-lg">No se encontraron productos</p>
            </div>
          </div>
        ) : (
          productosPorCategoria.map(cat => (
            <div key={cat.id} className="mb-10">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
                  {cat.nombre}
                </h2>
                {cat.descripcion && (
                  <p className="text-gray-600 ml-4">{cat.descripcion}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.productos.map(producto => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal del carrito */}
      <CartModal isOpen={isCartOpen} />
    </div>
  );
};

export default MenuPage;
