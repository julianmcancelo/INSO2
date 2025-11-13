'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { categoriaAPI } from '@/lib/api';
import PrivateRoute from '@/components/shared/PrivateRoute';

export default function AdminCategorias() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: ''
  });

  const cargarCategorias = useCallback(async () => {
    if (!user?.localId) return;
    try {
      setLoading(true);
      const response = await categoriaAPI.getByLocal(user.localId);
      setCategorias(response.data.categorias || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user?.localId) {
      cargarCategorias();
    } else {
      setLoading(false);
    }
  }, [user, cargarCategorias]);

  const abrirModalNuevo = () => {
    setCategoriaEditar(null);
    setFormData({ nombre: '', descripcion: '', icono: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (categoria) => {
    setCategoriaEditar(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      if (categoriaEditar) {
        await categoriaAPI.update(categoriaEditar.id, formData);
        toast.success('Categoría actualizada');
      } else {
        await categoriaAPI.create(formData);
        toast.success('Categoría creada');
      }
      setShowModal(false);
      cargarCategorias();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar categoría');
    }
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
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
              </div>
              <button 
                onClick={abrirModalNuevo}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Plus size={18} />
                <span>Nueva Categoría</span>
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
                Primero debes crear y seleccionar un local para gestionar categorías.
              </p>
              <Link href="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
                Ir al Dashboard
              </Link>
            </div>
          ) : categorias.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">No hay categorías creadas</p>
              <button 
                onClick={abrirModalNuevo}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Crear Primera Categoría
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <ul className="divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <li key={categoria.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GripVertical size={20} className="text-gray-400 cursor-move" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{categoria.nombre}</h3>
                        {categoria.descripcion && (
                          <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => abrirModalEditar(categoria)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => eliminarCategoria(categoria.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                  >
                    {categoriaEditar ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
