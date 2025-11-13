'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Copy, Check, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import PrivateRoute from '@/components/shared/PrivateRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminInvitaciones() {
  const { user } = useAuth();
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      cargarInvitaciones();
    } else {
      setLoading(false);
    }
  }, [user]);

  const cargarInvitaciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/invitaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitaciones(response.data.invitaciones || []);
    } catch (error) {
      console.error('Error al cargar invitaciones:', error);
      toast.error('Error al cargar invitaciones');
    } finally {
      setLoading(false);
    }
  };

  const copiarEnlace = (token) => {
    const enlace = `${API_URL}/registro/${token}`;
    navigator.clipboard.writeText(enlace);
    setCopiedToken(token);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const isExpired = (fecha) => new Date() > new Date(fecha);

  if (user?.rol !== 'superadmin') {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">Solo el superadministrador puede ver las invitaciones</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Mail size={32} className="text-primary" />
                  Invitaciones Generadas
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Enlaces de registro para nuevos locales
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : invitaciones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Mail className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No hay invitaciones generadas</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expira
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Enlace
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitaciones.map((inv) => {
                    const expired = isExpired(inv.expiraEn);
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{inv.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {inv.usado ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                              <Check size={14} />
                              Usado
                            </span>
                          ) : expired ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                              <XCircle size={14} />
                              Expirado
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                              <Clock size={14} />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inv.expiraEn).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {!inv.usado && !expired && (
                            <button
                              onClick={() => copiarEnlace(inv.token)}
                              className="text-primary hover:text-orange-700 flex items-center gap-2 ml-auto"
                            >
                              {copiedToken === inv.token ? (
                                <>
                                  <Check size={16} />
                                  Copiado
                                </>
                              ) : (
                                <>
                                  <Copy size={16} />
                                  Copiar enlace
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}
