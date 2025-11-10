import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Mail, Phone, Store, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminSolicitudes = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('pendiente');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarSolicitudes = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/solicitudes?estado=${filtro}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSolicitudes(response.data.solicitudes);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      cargarSolicitudes();
    }
  }, [user, cargarSolicitudes]);

  const handleAprobar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

  const confirmarAprobacion = async (enviarEmail) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/solicitudes/${solicitudSeleccionada.id}/aprobar`,
        { enviarEmail },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Solicitud aprobada y local creado');
      
      if (!enviarEmail) {
        // Copiar enlace al portapapeles
        await navigator.clipboard.writeText(response.data.invitacion.url);
        toast.info('Enlace de invitación copiado al portapapeles');
      }

      setShowModal(false);
      setSolicitudSeleccionada(null);
      cargarSolicitudes();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al aprobar solicitud');
    }
  };

  const handleRechazar = async (id) => {
    if (!window.confirm('¿Estás seguro de rechazar esta solicitud?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/solicitudes/${id}/rechazar`,
        { notas: 'Rechazada por el superadmin' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Solicitud rechazada');
      cargarSolicitudes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al rechazar solicitud');
    }
  };

  if (user?.rol !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Solo el superadministrador puede acceder</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Solicitudes</h1>
            </div>

            {/* Filtros */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFiltro('pendiente')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtro === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFiltro('aprobada')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtro === 'aprobada'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aprobadas
              </button>
              <button
                onClick={() => setFiltro('rechazada')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtro === 'rechazada'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rechazadas
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No hay solicitudes {filtro}s</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solicitudes.map(solicitud => (
              <div key={solicitud.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-primary to-orange-500 p-4 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Store size={20} className="mr-2" />
                    {solicitud.nombreNegocio}
                  </h3>
                  <p className="text-sm text-red-100 mt-1">
                    {new Date(solicitud.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Contacto</p>
                    <p className="font-medium text-gray-900">{solicitud.nombreContacto}</p>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span className="truncate">{solicitud.email}</span>
                  </div>

                  {solicitud.telefono && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>{solicitud.telefono}</span>
                    </div>
                  )}

                  {solicitud.tipoNegocio && (
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {solicitud.tipoNegocio}
                      </span>
                    </div>
                  )}

                  {solicitud.mensaje && (
                    <div>
                      <p className="text-sm text-gray-500">Mensaje:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{solicitud.mensaje}</p>
                    </div>
                  )}

                  {/* Estado Badge */}
                  <div className="pt-3 border-t">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      solicitud.estado === 'pendiente' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : solicitud.estado === 'aprobada'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {solicitud.estado === 'pendiente' && <Clock size={14} className="mr-1" />}
                      {solicitud.estado === 'aprobada' && <CheckCircle size={14} className="mr-1" />}
                      {solicitud.estado === 'rechazada' && <XCircle size={14} className="mr-1" />}
                      {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                    </span>
                  </div>

                  {/* Acciones */}
                  {solicitud.estado === 'pendiente' && (
                    <div className="flex space-x-2 pt-3">
                      <button
                        onClick={() => handleAprobar(solicitud)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(solicitud.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center"
                      >
                        <XCircle size={16} className="mr-1" />
                        Rechazar
                      </button>
                    </div>
                  )}

                  {solicitud.estado === 'aprobada' && solicitud.local && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-500">Local creado:</p>
                      <Link 
                        to={`/admin/locales`}
                        className="text-primary font-medium hover:underline"
                      >
                        {solicitud.local.nombre}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Aprobación */}
      {showModal && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Aprobar Solicitud
            </h3>
            <p className="text-gray-600 mb-6">
              Se creará el local <strong>{solicitudSeleccionada.nombreNegocio}</strong> y una invitación para <strong>{solicitudSeleccionada.email}</strong>.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => confirmarAprobacion(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
              >
                <Send size={18} className="mr-2" />
                Enviar Invitación por Email
              </button>
              
              <button
                onClick={() => confirmarAprobacion(false)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition"
              >
                Generar Enlace (Copiar)
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSolicitudSeleccionada(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSolicitudes;
