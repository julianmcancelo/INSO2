'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Edit, Trash2, Shield, Users as UsersIcon, CheckCircle, XCircle, Store } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import PrivateRoute from '@/components/shared/PrivateRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin',
    localId: '',
    activo: true
  });

  useEffect(() => {
    if (user?.rol === 'superadmin') {
      cargarDatos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [usuariosRes, localesRes] = await Promise.all([
        axios.get(`${API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/locales`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsuarios(usuariosRes.data.usuarios || []);
      setLocales(localesRes.data.locales || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUser(usuario);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rol: usuario.rol,
        localId: usuario.localId || '',
        activo: usuario.activo
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'admin',
        localId: '',
        activo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || (!editingUser && !formData.password)) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const dataToSend = { ...formData };
      
      // Si no se proporciona password en edición, no enviarlo
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      // Convertir localId a número o null
      dataToSend.localId = dataToSend.localId ? parseInt(dataToSend.localId) : null;

      if (editingUser) {
        await axios.put(
          `${API_URL}/api/usuarios/${editingUser.id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Usuario actualizado correctamente');
      } else {
        await axios.post(
          `${API_URL}/api/usuarios`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Usuario creado correctamente');
      }

      handleCloseModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (usuarioId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/usuarios/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Usuario eliminado correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const getRolBadge = (rol) => {
    const badges = {
      superadmin: { color: 'bg-purple-100 text-purple-800', label: 'Super Admin' },
      admin: { color: 'bg-blue-100 text-blue-800', label: 'Admin' },
      staff: { color: 'bg-green-100 text-green-800', label: 'Staff' }
    };
    return badges[rol] || badges.admin;
  };

  if (user?.rol !== 'superadmin') {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">Solo el superadministrador puede gestionar usuarios</p>
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
                    <UsersIcon size={32} className="text-primary" />
                    Gestión de Usuarios
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Administra los usuarios del sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                <UserPlus size={18} />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <UsersIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">No hay usuarios registrados</p>
              <button
                onClick={() => handleOpenModal()}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Crear Primer Usuario
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Local
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.map((usuario) => {
                    const rolBadge = getRolBadge(usuario.rol);
                    return (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                            <div className="text-sm text-gray-500">{usuario.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rolBadge.color}`}>
                            {rolBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {usuario.local ? (
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Store size={16} className="text-gray-400" />
                              {usuario.local.nombre}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin local</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {usuario.activo ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle size={16} />
                              Activo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <XCircle size={16} />
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(usuario)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          {usuario.id !== user.id && (
                            <button
                              onClick={() => handleDelete(usuario.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña {editingUser && '(dejar en blanco para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                {(formData.rol === 'admin' || formData.rol === 'staff') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local *
                    </label>
                    <select
                      value={formData.localId}
                      onChange={(e) => setFormData({ ...formData, localId: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Seleccionar local...</option>
                      {locales.map(local => (
                        <option key={local.id} value={local.id}>
                          {local.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="activo" className="text-sm text-gray-700">
                    Usuario activo
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                  >
                    {editingUser ? 'Actualizar' : 'Crear'}
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
