'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Store, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { localAPI } from '@/lib/api';
import PrivateRoute from '@/components/shared/PrivateRoute';

export default function AdminLocales() {
  const { user } = useAuth();
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarLocales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await localAPI.getAll();
      setLocales(response.data.locales || []);
    } catch (error) {
      console.error('Error al cargar locales:', error);
      toast.error('Error al cargar locales');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      cargarLocales();
    } else {
      setLoading(false);
    }
  }, [user, cargarLocales]);

  const handleEliminarLocal = async (local) => {
    if (!window.confirm(`¿Estás seguro de eliminar el local "${local.nombre}"? Esto eliminará todos sus datos asociados.`)) {
      return;
    }

    try {
      await localAPI.delete(local.id);
      setLocales(prev => prev.filter(l => l.id !== local.id));
      toast.success('Local eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al eliminar local');
    }
  };

  if (user?.rol !== 'superadmin') {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">Solo el superadministrador puede acceder a esta página</p>
          </div>
        </div>
      </PrivateRoute>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Locales</h1>
              </div>
              <Link
                href="/admin/locales/nuevo"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Plus size={18} />
                <span>Nuevo Local</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : locales.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Store className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No hay locales creados</p>
              <Link
                href="/admin/locales/nuevo"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Crear Primer Local
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locales.map(local => (
                <div key={local.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div 
                    className="h-32 p-6 flex items-center justify-center"
                    style={{ backgroundColor: local.colorPrimario || '#ef4444' }}
                  >
                    {local.logoBase64 ? (
                      <img 
                        src={local.logoBase64} 
                        alt={local.nombre}
                        className="h-20 w-20 object-contain bg-white rounded-full p-2"
                      />
                    ) : (
                      <Store className="text-white" size={48} />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{local.nombre}</h3>
                    {local.descripcion && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{local.descripcion}</p>
                    )}
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {local.direccion && (
                        <p className="flex items-start gap-2">
                          <span className="font-medium">📍</span>
                          <span>{local.direccion}</span>
                        </p>
                      )}
                      {local.telefono && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">📞</span>
                          <span>{local.telefono}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <span className="font-medium">🔗</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">/menu/{local.slug}</code>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/locales/editar/${local.id}`}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-center text-sm flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleEliminarLocal(local)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}
