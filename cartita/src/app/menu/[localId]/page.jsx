'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ShoppingCart, Search, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function MenuPage() {
  const params = useParams();
  const { addToCart, getTotalItems, openCart } = useCart();
  const [local, setLocal] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.localId]);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      
      // Cargar los datos del local
      const localResponse = await axios.get(`${API_URL}/api/locales/slug/${params.localId}`);
      const localData = localResponse.data.local;
      setLocal(localData);

      // Cargar las categorías
      const categoriasResponse = await axios.get(`${API_URL}/api/categorias/local/${localData.id}`);
      setCategorias(categoriasResponse.data.categorias || []);

      // Cargar los productos disponibles
      const productosResponse = await axios.get(`${API_URL}/api/productos/local/${localData.id}?disponible=true`);
      setProductos(productosResponse.data.productos || []);
    } catch (error) {
      console.error('Error cargando menú:', error);
      toast.error('Error al cargar el menú');
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

  const handleAddToCart = (producto) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      imagen: producto.imagenBase64,
      cantidad: 1
    });
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando menú..." />;
  }

  if (!local) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Local no encontrado</h2>
          <p className="text-gray-600">El local que buscas no existe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{local.nombre}</h1>
              {local.direccion && (
                <p className="text-sm text-gray-600">{local.direccion}</p>
              )}
            </div>
            
            {/* Botón del Carrito */}
            <button
              onClick={openCart}
              className="relative bg-primary text-white p-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </header>

      {/* Categories Filter */}
      {categorias.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategoria(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  !selectedCategoria
                    ? 'bg-primary text-white'
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
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoria.icono && <span>{categoria.icono}</span>}
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredProductos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {producto.imagenBase64 && (
                  <img
                    src={producto.imagenBase64}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {producto.nombre}
                    </h3>
                    {producto.categoria && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                        {producto.categoria.icono} {producto.categoria.nombre}
                      </span>
                    )}
                  </div>
                  {producto.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  )}
                  {producto.tiempoPreparacion && (
                    <p className="text-xs text-gray-500 mb-2">
                      ⏱️ {producto.tiempoPreparacion} min
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ${parseFloat(producto.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => handleAddToCart(producto)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
