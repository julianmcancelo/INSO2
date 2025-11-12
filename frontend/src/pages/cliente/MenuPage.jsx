import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Search, X, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLocal } from '../../context/LocalContext';
import { useCart } from '../../context/CartContext';
import { localAPI, categoriaAPI, productoAPI } from '../../services/api';
import ProductoCard from '../../components/cliente/ProductoCard';
import ProductoSkeleton from '../../components/cliente/ProductoSkeleton';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const categoriasRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Detectar scroll para mostrar botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular altura del header para scroll suave
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [local]);

  // Scroll suave a categoría
  const scrollToCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    if (categoriaId) {
      const element = document.getElementById(`categoria-${categoriaId}`);
      if (element) {
        const offset = headerHeight + (categoriasRef.current?.offsetHeight || 0) + 20;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

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

  if (localLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 pb-20">
      {/* Header */}
      <header ref={headerRef} className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-orange-100">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {local.logoBase64 && (
                <img 
                  src={local.logoBase64} 
                  alt={local.nombre}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg flex-shrink-0 ring-2 ring-orange-100"
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{local.nombre}</h1>
                {local.descripcion && (
                  <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">{local.descripcion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="mt-3 sm:mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 pointer-events-none" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filtro de categorías */}
      <div ref={categoriasRef} className="bg-white/95 backdrop-blur-lg border-b border-orange-100 sticky z-30 shadow-md" style={{ top: `${headerHeight}px` }}>
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto py-3 sm:py-4 scrollbar-hide snap-x snap-mandatory">
            <button
              onClick={() => scrollToCategoria(null)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all font-medium shadow-md snap-start flex-shrink-0 text-sm sm:text-base ${
                !categoriaSeleccionada
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 active:scale-95'
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToCategoria(cat.id)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all font-medium shadow-md snap-start flex-shrink-0 text-sm sm:text-base ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 active:scale-95'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Estado de horarios */}
        {local.horarioAtencion && Object.keys(local.horarioAtencion).length > 0 && (
          <div className="mb-6">
            <HorarioStatus horarioAtencion={local.horarioAtencion} />
          </div>
        )}

        {loading ? (
          // Skeleton loaders
          <div className="space-y-8">
            {[1, 2].map(catIndex => (
              <div key={catIndex}>
                <div className="mb-4">
                  <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map(prodIndex => (
                    <ProductoSkeleton key={prodIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : productosPorCategoria.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md mx-auto">
              <p className="text-gray-600 text-base sm:text-lg">No se encontraron productos</p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </div>
        ) : (
          productosPorCategoria.map(cat => (
            <div key={cat.id} id={`categoria-${cat.id}`} className="mb-8 sm:mb-10 scroll-mt-32">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
                  {cat.nombre}
                </h2>
                {cat.descripcion && (
                  <p className="text-sm sm:text-base text-gray-600 ml-3 sm:ml-4">{cat.descripcion}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cat.productos.map(producto => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Footer - Siempre visible */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-sm text-gray-600">
            Armado con ♥ por el equipo de Ingeniería 2
          </p>
        </div>
      </footer>

      {/* Modal del carrito */}
      <CartModal isOpen={isCartOpen} />

      {/* Botón flotante del carrito (móvil) */}
      {getTotalItems() > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-4 sm:right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:from-orange-600 hover:to-red-600 transition-all z-40 active:scale-95 animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center ring-4 ring-white shadow-lg">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Botón scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-4 sm:left-6 bg-white text-orange-600 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all z-40 border-2 border-orange-200 active:scale-95"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default MenuPage;
