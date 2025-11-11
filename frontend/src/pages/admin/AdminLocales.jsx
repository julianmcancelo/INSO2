import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Store, Users, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { localAPI, invitationAPI } from '../../services/api';
import LocalFormModal from '../../components/admin/LocalFormModal';

const AdminLocales = () => {
  const { user } = useAuth();
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [localEditar, setLocalEditar] = useState(null);

  const cargarLocales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await localAPI.getAll();
      setLocales(response.data.locales);
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

  const handleNuevoLocal = () => {
    setLocalEditar(null);
    setShowModal(true);
  };

  const handleEditarLocal = (local) => {
    setLocalEditar(local);
    setShowModal(true);
  };

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

  const handleModalClose = () => {
    setShowModal(false);
    setLocalEditar(null);
    cargarLocales();
  };

  const handleGenerarInvitacion = async (local) => {
    try {
      const response = await invitationAPI.create({
        localId: local.id,
        rol: 'admin',
        diasExpiracion: 7
      });

      const inviteUrl = `${window.location.origin}/register/${response.data.invitacion.token}`;
      
      // Copiar al portapapeles
      await navigator.clipboard.writeText(inviteUrl);
      
      toast.success('¡Enlace de invitación copiado al portapapeles!', {
        autoClose: 5000
      });

      // Mostrar modal con el enlace
      alert(`Enlace de invitación generado y copiado:\n\n${inviteUrl}\n\nVálido por 7 días`);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar invitación');
    }
  };

  if (user?.rol !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Solo el superadministrador puede acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Locales</h1>
            </div>
            <button
              onClick={handleNuevoLocal}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <Plus size={18} />
              <span>Nuevo Local</span>
            </button>
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
            <button
              onClick={handleNuevoLocal}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Crear Primer Local
            </button>
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
                      className="h-24 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {local.nombre}
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Slug / URL</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      /{local.slug}
                    </p>
                  </div>

                  {local.descripcion && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {local.descripcion}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Users size={16} className="mr-2" />
                    <span>
                      {local.usuarios?.length || 0} administrador(es)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      local.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {local.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleGenerarInvitacion(local)}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      <UserPlus size={16} />
                      <span>Generar Invitación</span>
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditarLocal(local)}
                        className="flex-1 flex items-center justify-center space-x-1 text-blue-600 hover:bg-blue-50 py-2 rounded transition"
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleEliminarLocal(local)}
                        className="flex-1 flex items-center justify-center space-x-1 text-red-600 hover:bg-red-50 py-2 rounded transition"
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <LocalFormModal
          local={localEditar}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminLocales;
