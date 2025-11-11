import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Grid, BarChart3, LogOut, Store, FileText, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { pedidoAPI } from '../../services/api';
import socketService from '../../services/socket';

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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {user?.nombre} ({user?.rol})
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje para superadmin sin local */}
        {user?.rol === 'superadmin' && !user?.localId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Bienvenido, Superadministrador
            </h3>
            <p className="text-blue-700 mb-4">
              Comienza creando locales para gestionar diferentes negocios de forma independiente.
            </p>
            <Link
              to="/admin/locales"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Store size={18} />
              <span>Gestionar Locales</span>
            </Link>
          </div>
        )}

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pedidos Hoy</p>
                  <p className="text-3xl font-bold text-gray-900">{estadisticas.totalPedidos}</p>
                </div>
                <ShoppingBag className="text-blue-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
                </div>
                <Package className="text-yellow-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Preparación</p>
                  <p className="text-3xl font-bold text-blue-600">{estadisticas.preparando}</p>
                </div>
                <Package className="text-blue-500" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ventas Hoy</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${estadisticas.totalVentas.toFixed(0)}
                  </p>
                </div>
                <BarChart3 className="text-green-500" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {user?.rol === 'superadmin' && (
            <>
              <Link
                to="/admin/solicitudes"
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow p-6 hover:shadow-md transition text-white"
              >
                <FileText className="mb-4" size={32} />
                <h3 className="text-lg font-semibold mb-2">Solicitudes</h3>
                <p className="text-sm text-green-100">Revisar nuevas solicitudes</p>
              </Link>
              
              <Link
                to="/admin/locales"
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 hover:shadow-md transition text-white"
              >
                <Store className="mb-4" size={32} />
                <h3 className="text-lg font-semibold mb-2">Gestionar Locales</h3>
                <p className="text-sm text-blue-100">Crear y administrar locales</p>
              </Link>
            </>
          )}
          
          <Link
            to="/admin/pedidos"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
          >
            <ShoppingBag className="text-primary mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestionar Pedidos</h3>
            <p className="text-sm text-gray-600">Ver y administrar todos los pedidos</p>
          </Link>

          <Link
            to="/admin/productos"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
          >
            <Package className="text-primary mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos</h3>
            <p className="text-sm text-gray-600">Administrar productos y precios</p>
          </Link>

          <Link
            to="/admin/categorias"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
          >
            <Grid className="text-primary mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Categorías</h3>
            <p className="text-sm text-gray-600">Organizar categorías del menú</p>
          </Link>

          <Link
            to="/admin/qr"
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow p-6 hover:shadow-md transition text-white"
          >
            <QrCode className="mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Código QR</h3>
            <p className="text-sm text-purple-100">Ver y descargar QR del menú</p>
          </Link>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Pedidos Recientes</h2>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
