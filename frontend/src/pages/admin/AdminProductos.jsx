import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { productoAPI, categoriaAPI } from '../../services/api';

const AdminProductos = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!user?.localId) return;
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        productoAPI.getByLocal(user.localId),
        categoriaAPI.getByLocal(user.localId)
      ]);
      setProductos(productosRes.data.productos);
      setCategorias(categoriasRes.data.categorias);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user) {
      if (user.localId) {
        cargarDatos();
      } else {
        setLoading(false);
      }
    }
  }, [user, cargarDatos]);

  const toggleDisponibilidad = async (producto) => {
    try {
      await productoAPI.updateDisponibilidad(producto.id, !producto.disponible);
      setProductos(prev => prev.map(p => 
        p.id === producto.id ? { ...p, disponible: !p.disponible } : p
      ));
      toast.success(
        producto.disponible ? 'Producto marcado como no disponible' : 'Producto disponible nuevamente'
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar disponibilidad');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productoAPI.delete(id);
      setProductos(prev => prev.filter(p => p.id !== id));
      toast.success('Producto eliminado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const productosPorCategoria = categorias.map(cat => ({
    ...cat,
    productos: productos.filter(p => p.categoriaId === cat.id)
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            </div>
            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
              <Plus size={18} />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : !user?.localId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Selecciona un Local</h3>
            <p className="text-yellow-700 mb-4">
              Como superadministrador, primero debes crear y seleccionar un local para gestionar productos.
            </p>
            <Link to="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
              Ir al Dashboard
            </Link>
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No hay productos creados</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
              Crear Primer Producto
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {productosPorCategoria.map(categoria => (
              categoria.productos.length > 0 && (
                <div key={categoria.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoria.nombre}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoria.productos.map(producto => (
                      <div key={producto.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {producto.imagenBase64 && (
                          <div className="h-48 bg-gray-200 relative">
                            <img
                              src={producto.imagenBase64}
                              alt={producto.nombre}
                              className="w-full h-full object-cover"
                            />
                            {!producto.disponible && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                                  No Disponible
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {producto.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {producto.descripcion}
                          </p>
                          <p className="text-2xl font-bold text-primary mb-3">
                            ${producto.precio}
                          </p>

                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleDisponibilidad(producto)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium ${
                                producto.disponible
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {producto.disponible ? (
                                <>
                                  <ToggleRight size={18} />
                                  <span>Disponible</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft size={18} />
                                  <span>No disponible</span>
                                </>
                              )}
                            </button>

                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => eliminarProducto(producto.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductos;
