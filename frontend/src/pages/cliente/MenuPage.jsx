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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
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
              className="relative bg-primary text-white p-3 rounded-full hover:opacity-90 transition"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="badge-notification bg-red-600 text-white">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filtro de categorías */}
      <div className="bg-white border-b sticky top-[140px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                !categoriaSeleccionada
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <main className="container mx-auto px-4 py-6">
        {productosPorCategoria.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontraron productos</p>
          </div>
        ) : (
          productosPorCategoria.map(cat => (
            <div key={cat.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{cat.nombre}</h2>
              {cat.descripcion && (
                <p className="text-gray-600 mb-4">{cat.descripcion}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Modal de bienvenida */}
      {showBienvenida && local && (
        <BienvenidaModal 
          local={local} 
          onComplete={handleBienvenidaComplete} 
        />
      )}
    </div>
  );
};

export default MenuPage;
