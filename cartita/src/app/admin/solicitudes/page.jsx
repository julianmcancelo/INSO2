'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Mail, Phone, Building, CheckCircle, XCircle, Clock, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import PrivateRoute from '@/components/shared/PrivateRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminSolicitudes() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // todas, pendientes, aceptadas, rechazadas
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      cargarSolicitudes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/solicitudes`);
      setSolicitudes(response.data.solicitudes || []);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAceptar = async (solicitudId) => {
    if (!window.confirm('¿Estás seguro de aceptar esta solicitud? Se generará un enlace de invitación.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/solicitudes/${solicitudId}/aceptar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { invitacion } = response.data;
      
      // Mostrar modal con el enlace
      const enlace = invitacion.url;
      const mensaje = `Solicitud aceptada!\n\nEnlace de invitación:\n${enlace}\n\nEste enlace expira el: ${new Date(invitacion.expiraEn).toLocaleDateString('es-AR')}`;
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(enlace);
      
      alert(mensaje + '\n\n✅ Enlace copiado al portapapeles');
      toast.success('Solicitud aceptada e invitación generada');
      
      cargarSolicitudes();
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      const errorMsg = error.response?.data?.error || 'Error al aceptar solicitud';
      toast.error(errorMsg);
    }
  };

  const handleRechazar = async (solicitudId) => {
    if (!window.confirm('¿Estás seguro de rechazar esta solicitud?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/solicitudes/${solicitudId}`,
        { estado: 'rechazada' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Solicitud rechazada');
      cargarSolicitudes();
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      toast.error('Error al rechazar solicitud');
    }
  };

  const handleVerInvitacion = async (solicitudId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/solicitudes/${solicitudId}?invitacion=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { invitacion } = response.data;
      const enlace = invitacion.url;
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(enlace);
      setCopiedId(solicitudId);
      setTimeout(() => setCopiedId(null), 2000);
      
      const expiracion = new Date(invitacion.expiraEn).toLocaleDateString('es-AR');
      const usado = invitacion.usado ? '❌ YA USADO' : '✅ Disponible';
      
      alert(`Enlace de invitación:\n${enlace}\n\nEstado: ${usado}\nExpira: ${expiracion}\n\n✅ Enlace copiado al portapapeles`);
      
      toast.success('Enlace copiado al portapapeles');
    } catch (error) {
      console.error('Error al obtener invitación:', error);
      const errorMsg = error.response?.data?.error || 'Error al obtener invitación';
      toast.error(errorMsg);
    }
  };

  const handleRegenerarInvitacion = async (solicitudId) => {
    if (!window.confirm('¿Generar una nueva invitación? El enlace anterior dejará de funcionar.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/solicitudes/${solicitudId}/regenerar-invitacion`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { invitacion } = response.data;
      const enlace = invitacion.url;
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(enlace);
      
      const expiracion = new Date(invitacion.expiraEn).toLocaleDateString('es-AR');
      
      alert(`Nueva invitación generada!\n\n${enlace}\n\nExpira: ${expiracion}\n\n✅ Enlace copiado al portapapeles\n📧 Email enviado a: ${invitacion.email}`);
      
      toast.success('Nueva invitación generada y enviada');
      cargarSolicitudes();
    } catch (error) {
      console.error('Error al regenerar invitación:', error);
      const errorMsg = error.response?.data?.error || 'Error al regenerar invitación';
      toast.error(errorMsg);
    }
  };

  const solicitudesFiltradas = solicitudes.filter(sol => {
    if (filter === 'todas') return true;
    if (filter === 'pendientes') return sol.estado === 'pendiente';
    if (filter === 'aceptadas') return sol.estado === 'aceptada';
    if (filter === 'rechazadas') return sol.estado === 'rechazada';
    return true;
  });

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
      aceptada: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aceptada' },
      rechazada: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rechazada' }
    };
    return badges[estado] || badges.pendiente;
  };

  if (user?.rol !== 'superadmin') {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">Solo el superadministrador puede ver las solicitudes</p>
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText size={32} className="text-primary" />
                    Solicitudes de Locales
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestiona las solicitudes de nuevos restaurantes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'todas'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({solicitudes.length})
              </button>
              <button
                onClick={() => setFilter('pendientes')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'pendientes'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes ({solicitudes.filter(s => s.estado === 'pendiente').length})
              </button>
              <button
                onClick={() => setFilter('aceptadas')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'aceptadas'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aceptadas ({solicitudes.filter(s => s.estado === 'aceptada').length})
              </button>
              <button
                onClick={() => setFilter('rechazadas')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'rechazadas'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rechazadas ({solicitudes.filter(s => s.estado === 'rechazada').length})
              </button>
            </div>
          </div>

          {/* Lista de solicitudes */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No hay solicitudes {filter !== 'todas' ? filter : ''}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesFiltradas.map((solicitud) => {
                const estadoBadge = getEstadoBadge(solicitud.estado);
                const IconoEstado = estadoBadge.icon;

                return (
                  <div key={solicitud.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{solicitud.nombreNegocio}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${estadoBadge.color}`}>
                            <IconoEstado size={14} />
                            {estadoBadge.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span>{solicitud.nombreContacto}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <a href={`mailto:${solicitud.email}`} className="text-primary hover:underline">
                              {solicitud.email}
                            </a>
                          </div>
                          {solicitud.telefono && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-gray-400" />
                              <a href={`tel:${solicitud.telefono}`} className="text-primary hover:underline">
                                {solicitud.telefono}
                              </a>
                            </div>
                          )}
                          {solicitud.tipoNegocio && (
                            <div className="flex items-center gap-2">
                              <Building size={16} className="text-gray-400" />
                              <span className="capitalize">{solicitud.tipoNegocio}</span>
                            </div>
                          )}
                        </div>

                        {solicitud.mensaje && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{solicitud.mensaje}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Recibida: {new Date(solicitud.createdAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>

                      {solicitud.estado === 'pendiente' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAceptar(solicitud.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Aceptar y Generar Invitación
                          </button>
                          <button
                            onClick={() => handleRechazar(solicitud.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center gap-2"
                          >
                            <XCircle size={16} />
                            Rechazar
                          </button>
                        </div>
                      ) : solicitud.estado === 'aceptada' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 font-medium">
                            ✅ Invitación enviada
                          </span>
                          <button
                            onClick={() => handleVerInvitacion(solicitud.id)}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-medium flex items-center gap-1"
                            title="Ver enlace de invitación"
                          >
                            {copiedId === solicitud.id ? (
                              <>
                                <CheckCircle size={14} />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Ver Enlace
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRegenerarInvitacion(solicitud.id)}
                            className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-xs font-medium flex items-center gap-1"
                            title="Regenerar y reenviar invitación"
                          >
                            <RefreshCw size={14} />
                            Reenviar
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}
