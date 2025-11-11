import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Grid, LogOut, Store, FileText, QrCode, Clock, Settings, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { pedidoAPI } from '../../services/api';
import socketService from '../../services/socket';
import BrandLogo from '../../components/BrandLogo';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  const cargarDatos = useCallback(async () => {
    if (!user?.localId) return;
    try {
      // Cargar estadísticas del día
      const statsResponse = await pedidoAPI.getEstadisticasHoy(user.localId);
      setEstadisticas(statsResponse.data.estadisticas);

      // Cargar pedidos recientes
      const pedidosResponse = await pedidoAPI.getByLocal(user.localId, { limit: 5 });
      setPedidosRecientes(pedidosResponse.data.pedidos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user?.localId) {
      cargarDatos();
      
      // Conectar a Socket.IO
      socketService.connect();
      socketService.joinLocal(user.localId);

      // Escuchar nuevos pedidos
      socketService.on('nuevo-pedido', () => {
        cargarDatos();
      });

      return () => {
        socketService.leaveLocal(user.localId);
      };
    }
  }, [user, cargarDatos]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo size="sm" showText={true} />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
                  <p className="text-xs text-orange-600 capitalize">{user?.rol}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje para superadmin sin local */}
        {user?.rol === 'superadmin' && !user?.localId && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Panel de Control Principal
                </h3>
                <p className="text-gray-600">
                  Administra los negocios y usuarios de la plataforma desde este panel central.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/admin/locales"
                  className="flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 px-6 py-5 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Store size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">Negocios</p>
                    <p className="text-sm text-gray-600">Administrar locales</p>
                  </div>
                </Link>

                <Link
                  to="/admin/usuarios"
                  className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 px-6 py-5 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="bg-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Users size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">Usuarios</p>
                    <p className="text-sm text-gray-600">Gestionar accesos</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas - Solo para usuarios con local */}
        {estadisticas && user?.localId && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Estadísticas de Hoy</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-orange-600">
                    <ShoppingBag size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.totalPedidos}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-600">
                    <Clock size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.pendientes}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-blue-600">
                    <Package size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">En Preparación</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.preparando}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-green-600">
                    <DollarSign size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Ventas Hoy</p>
                <p className="text-3xl font-bold text-gray-900">${estadisticas.totalVentas.toFixed(0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Grid size={20} className="text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Accesos Rápidos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {user?.rol === 'superadmin' && (
            <>
              <Link
                to="/admin/solicitudes"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Solicitudes</h3>
                <p className="text-sm text-gray-600">Revisar nuevas solicitudes</p>
              </Link>
              
              <Link
                to="/admin/locales"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <Store size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Negocios</h3>
                <p className="text-sm text-gray-600">Crear y administrar locales</p>
              </Link>

              <Link
                to="/admin/usuarios"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios</h3>
                <p className="text-sm text-gray-600">Gestionar administradores</p>
              </Link>
            </>
          )}
          
          {user?.localId && (
            <>
              <Link
                to="/admin/pedidos"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedidos</h3>
                <p className="text-sm text-gray-600">Ver y administrar pedidos</p>
              </Link>

              <Link
                to="/admin/productos"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos</h3>
                <p className="text-sm text-gray-600">Administrar productos</p>
              </Link>

              <Link
                to="/admin/categorias"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <Grid size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Categorías</h3>
                <p className="text-sm text-gray-600">Organizar el menú</p>
              </Link>

              <Link
                to="/admin/qr"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <QrCode size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Código QR</h3>
                <p className="text-sm text-gray-600">Descargar QR del menú</p>
              </Link>

              <Link
                to="/admin/horarios"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
              >
                <div className="text-orange-600 mb-4">
                  <Clock size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Horarios</h3>
                <p className="text-sm text-gray-600">Configurar atención</p>
              </Link>
            </>
          )}

          {user?.rol === 'superadmin' && (
            <Link
              to="/admin/mantenimiento"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border border-gray-200"
            >
              <div className="text-gray-600 mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mantenimiento</h3>
              <p className="text-sm text-gray-600">Modo mantenimiento</p>
            </Link>
          )}
          </div>
        </div>

        {/* Pedidos recientes - Solo para usuarios con local */}
        {user?.localId && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={24} className="text-orange-600" />
                Pedidos Recientes
              </h2>
            </div>
            <div className="divide-y">
              {pedidosRecientes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No hay pedidos recientes
                </div>
              ) : (
                pedidosRecientes.map(pedido => (
                  <div key={pedido.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{pedido.numeroPedido}</p>
                        <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                        <p className="text-sm text-gray-500">
                          {pedido.tipoEntrega} {pedido.numeroMesa && `- Mesa ${pedido.numeroMesa}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${pedido.total}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.estado === 'preparando' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'listo' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pedido.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
