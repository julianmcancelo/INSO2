import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { pedidoAPI } from '../../services/api';
import socketService from '../../services/socket';

const AdminPedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);

  const cargarPedidos = useCallback(async () => {
    if (!user?.localId) return;
    try {
      setLoading(true);
      const response = await pedidoAPI.getByLocal(user.localId, { limit: 50 });
      setPedidos(response.data.pedidos);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user) {
      if (user.localId) {
        cargarPedidos();
        
        socketService.connect();
        socketService.joinLocal(user.localId);

        socketService.on('nuevo-pedido', (nuevoPedido) => {
          setPedidos(prev => [nuevoPedido, ...prev]);
          toast.info(`Nuevo pedido: ${nuevoPedido.numeroPedido}`);
        });

        socketService.on('pedido-actualizado', (pedidoActualizado) => {
          setPedidos(prev => prev.map(p => 
            p.id === pedidoActualizado.id ? pedidoActualizado : p
          ));
        });

        return () => {
          socketService.leaveLocal(user.localId);
        };
      } else {
        setLoading(false);
      }
    }
  }, [user, cargarPedidos]);

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await pedidoAPI.updateEstado(pedidoId, nuevoEstado);
      toast.success('Estado actualizado');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const pedidosFiltrados = pedidos.filter(p => 
    filtroEstado === 'todos' || p.estado === filtroEstado
  );

  const estados = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'preparando', label: 'En Preparación' },
    { value: 'listo', label: 'Listos' },
    { value: 'entregado', label: 'Entregados' },
    { value: 'cancelado', label: 'Cancelados' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
            </div>
            <button
              onClick={cargarPedidos}
              className="flex items-center space-x-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 text-sm sm:text-base"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Actualizar</span>
              <span className="sm:hidden">Refrescar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {estados.map(estado => (
              <button
                key={estado.value}
                onClick={() => setFiltroEstado(estado.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${
                  filtroEstado === estado.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : !user?.localId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Selecciona un Local</h3>
            <p className="text-yellow-700 mb-4">
              Como superadministrador, primero debes crear y seleccionar un local para gestionar pedidos.
            </p>
            <Link to="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
              Ir al Dashboard
            </Link>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No hay pedidos para mostrar</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No hay pedidos para mostrar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {pedidosFiltrados.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header del pedido */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pedido.numeroPedido}</h3>
                      <p className="text-sm text-gray-600">{pedido.clienteNombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${pedido.total}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(pedido.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detalles */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">{pedido.tipoEntrega}</span>
                  </div>
                  {pedido.numeroMesa && (
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="text-gray-600">Mesa:</span>
                      <span className="font-medium">{pedido.numeroMesa}</span>
                    </div>
                  )}
                  {pedido.clienteTelefono && (
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium">{pedido.clienteTelefono}</span>
                    </div>
                  )}

                  {/* Items */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {pedido.items?.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.cantidad}x {item.producto?.nombre}</span>
                          <span>${item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {pedido.notasCliente && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm font-semibold text-gray-700">Notas:</p>
                      <p className="text-sm text-gray-600 italic">{pedido.notasCliente}</p>
                    </div>
                  )}
                </div>

                {/* Cambiar estado */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <select
                    value={pedido.estado}
                    onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border-2 font-medium ${
                      pedido.estado === 'pendiente' ? 'border-yellow-500 bg-yellow-50 text-yellow-800' :
                      pedido.estado === 'preparando' ? 'border-blue-500 bg-blue-50 text-blue-800' :
                      pedido.estado === 'listo' ? 'border-green-500 bg-green-50 text-green-800' :
                      pedido.estado === 'entregado' ? 'border-gray-500 bg-gray-50 text-gray-800' :
                      'border-red-500 bg-red-50 text-red-800'
                    }`}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparando">En Preparación</option>
                    <option value="listo">Listo</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPedidos;
