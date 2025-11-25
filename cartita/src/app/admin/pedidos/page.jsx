'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, CheckCircle, Banknote, CreditCard, MapPin, Phone, FileImage } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { pedidoAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import PrivateRoute from '@/components/shared/PrivateRoute';

export default function AdminPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);

  const cargarPedidos = useCallback(async () => {
    if (!user?.localId) return;
    try {
      setLoading(true);
      const response = await pedidoAPI.getByLocal(user.localId, { limit: 50 });
      setPedidos(response.data.pedidos || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [user?.localId]);

  useEffect(() => {
    if (user?.localId) {
      cargarPedidos();
      
      // Socket.IO para tiempo real
      const socket = getSocket();
      
      socket.emit('join-local', user.localId);

      socket.on('nuevo-pedido', (nuevoPedido) => {
        setPedidos(prev => [nuevoPedido, ...prev]);
        toast.info(`Nuevo pedido: #${nuevoPedido.numeroPedido}`);
      });

      socket.on('pedido-actualizado', (pedidoActualizado) => {
        setPedidos(prev => prev.map(p => 
          p.id === pedidoActualizado.id ? pedidoActualizado : p
        ));
      });

      return () => {
        socket.emit('leave-local', user.localId);
        socket.off('nuevo-pedido');
        socket.off('pedido-actualizado');
      };
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
    { value: 'todos', label: 'Todos', color: 'gray' },
    { value: 'pendiente', label: 'Pendientes', color: 'yellow' },
    { value: 'preparando', label: 'En Preparación', color: 'blue' },
    { value: 'listo', label: 'Listos', color: 'green' },
    { value: 'entregado', label: 'Entregados', color: 'gray' },
    { value: 'cancelado', label: 'Cancelados', color: 'red' }
  ];

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      preparando: 'bg-blue-100 text-blue-800',
      listo: 'bg-green-100 text-green-800',
      entregado: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
              </div>
              <button
                onClick={cargarPedidos}
                className="flex items-center space-x-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 text-sm sm:text-base"
              >
                <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
            <div className="flex flex-wrap gap-2">
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
              <Link href="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90">
                Ir al Dashboard
              </Link>
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
                  <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Pedido #{pedido.numeroPedido}</h3>
                      <p className="text-sm text-gray-600">{pedido.nombreCliente}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    {/* Información de contacto y entrega */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} />
                        <span>{pedido.telefonoCliente}</span>
                      </div>
                      {pedido.tipoEntrega === 'envio' && pedido.direccion && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Envío a domicilio</p>
                            <p className="text-xs">{pedido.direccion}</p>
                            {pedido.referenciaDireccion && (
                              <p className="text-xs text-gray-600">Ref: {pedido.referenciaDireccion}</p>
                            )}
                          </div>
                        </div>
                      )}
                      {pedido.tipoEntrega === 'takeaway' && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} />
                          <span className="font-medium">Retiro en el local</span>
                        </div>
                      )}
                    </div>

                    {/* Items del pedido */}
                    <div className="space-y-2 mb-4">
                      {pedido.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.cantidad}x {item.producto?.nombre || 'Producto'}</span>
                          <span className="font-medium">${parseFloat(item.subtotal || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-xl text-primary">
                        ${parseFloat(pedido.total || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Información de pago */}
                    {pedido.metodoPago && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {pedido.metodoPago === 'efectivo' ? (
                            <Banknote size={18} className="text-green-600" />
                          ) : (
                            <CreditCard size={18} className="text-blue-600" />
                          )}
                          <span className="font-semibold text-sm">
                            {pedido.metodoPago === 'efectivo' ? 'Pago en Efectivo' : 'Transferencia Bancaria'}
                          </span>
                        </div>
                        
                        {pedido.metodoPago === 'efectivo' && pedido.montoPaga && (
                          <div className="text-sm space-y-1">
                            <p className="text-gray-700">
                              Cliente paga con: <span className="font-bold">${parseFloat(pedido.montoPaga).toFixed(2)}</span>
                            </p>
                            {pedido.cambioRequerido && parseFloat(pedido.cambioRequerido) > 0 && (
                              <p className="text-orange-700 font-semibold">
                                💰 Cambio a entregar: ${parseFloat(pedido.cambioRequerido).toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}

                        {pedido.metodoPago === 'transferencia' && (
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                pedido.estadoPago === 'confirmado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pedido.estadoPago === 'confirmado' ? 'Pago Verificado' : 'Pendiente de Verificación'}
                              </span>
                            </div>
                            {pedido.comprobanteBase64 && (
                              <button
                                onClick={() => window.open(pedido.comprobanteBase64, '_blank')}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs mt-2"
                              >
                                <FileImage size={14} />
                                Ver comprobante
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="mt-4 flex gap-2">
                      {pedido.estado === 'pendiente' && (
                        <button
                          onClick={() => cambiarEstado(pedido.id, 'preparando')}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                        >
                          Preparar
                        </button>
                      )}
                      {pedido.estado === 'preparando' && (
                        <button
                          onClick={() => cambiarEstado(pedido.id, 'listo')}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                        >
                          Marcar Listo
                        </button>
                      )}
                      {pedido.estado === 'listo' && (
                        <button
                          onClick={() => cambiarEstado(pedido.id, 'entregado')}
                          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
                        >
                          Entregar
                        </button>
                      )}
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
