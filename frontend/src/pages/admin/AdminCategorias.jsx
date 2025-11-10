import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { categoriaAPI } from '../../services/api';
import CategoriaFormModal from '../../components/admin/CategoriaFormModal';

const AdminCategorias = () => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  const cargarCategorias = useCallback(async () => {
    if (!user?.localId) return;
    try {
      setLoading(true);
      const response = await categoriaAPI.getByLocal(user.localId);
      setCategorias(response.data.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user) {
      if (user.localId) {
        cargarCategorias();
      } else {
        // Superadmin sin local seleccionado
        setLoading(false);
      }
    }
  }, [user, cargarCategorias]);

  const handleNuevaCategoria = () => {
    setCategoriaEditar(null);
    setShowModal(true);
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaEditar(categoria);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCategoriaEditar(null);
  };

  const handleModalSuccess = () => {
    cargarCategorias();
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await categoriaAPI.delete(id);
      setCategorias(prev => prev.filter(c => c.id !== id));
      toast.success('Categoría eliminada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar categoría');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            </div>
            <button 
              onClick={handleNuevaCategoria}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <Plus size={18} />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : !user?.localId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Selecciona un Local</h3>
            <p className="text-yellow-700 mb-4">
              Como superadministrador, primero debes crear y seleccionar un local para gestionar categorías.
            </p>
            <Link to="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
              Ir al Dashboard
            </Link>
          </div>
        ) : categorias.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No hay categorías creadas</p>
            <button 
              onClick={handleNuevaCategoria}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Crear Primera Categoría
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y">
              {categorias.map(categoria => (
                <div key={categoria.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {categoria.nombre}
                      </h3>
                      {categoria.descripcion && (
                        <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Orden: {categoria.orden}
                      </p>
                    </div>
                    
                    <div className="flex space-x-3 ml-4">
                      <button 
                        onClick={() => handleEditarCategoria(categoria)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => eliminarCategoria(categoria.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <CategoriaFormModal
          categoria={categoriaEditar}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default AdminCategorias;
