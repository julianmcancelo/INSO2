import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { pedidoAPI } from '../../services/api';
import socketService from '../../services/socket';
import LoadingSpinner from '../../components/LoadingSpinner';

const SeguimientoPedidoPage = () => {
  const { pedidoId, localId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPedido = useCallback(async () => {
    try {
      const response = await pedidoAPI.getById(pedidoId);
      setPedido(response.data.pedido);
    } catch (error) {
      console.error('Error al cargar pedido:', error);
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useEffect(() => {
    cargarPedido();
    
    // Conectar a Socket.IO
    socketService.connect();
    socketService.joinPedido(pedidoId);

    // Escuchar actualizaciones de estado
    socketService.on('estado-actualizado', (data) => {
      if (data.pedidoId === parseInt(pedidoId)) {
        setPedido(prev => ({ ...prev, estado: data.estado }));
      }
    });

    return () => {
      socketService.leavePedido(pedidoId);
    };
  }, [pedidoId, cargarPedido]);

  const getEstadoInfo = (estado) => {
    const estados = {
      pendiente: {
        label: 'Pedido Recibido',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        description: 'Hemos recibido tu pedido'
      },
      preparando: {
        label: 'En Preparación',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Estamos preparando tu pedido'
      },
      listo: {
        label: 'Listo para Entregar',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Tu pedido está listo'
      },
      entregado: {
        label: 'Entregado',
        icon: Truck,
        color: 'text-green-700',
        bgColor: 'bg-green-200',
        description: '¡Disfruta tu pedido!'
      },
      cancelado: {
        label: 'Cancelado',
        icon: Clock,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: 'El pedido fue cancelado'
      }
    };
    return estados[estado] || estados.pendiente;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando pedido..." />;
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido no encontrado</h2>
          <button
            onClick={() => navigate(`/menu/${localId}`)}
            className="text-primary hover:underline"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = getEstadoInfo(pedido.estado);
  const Icon = estadoInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seguimiento de Pedido</h1>
          <p className="text-gray-600">Pedido {pedido.numeroPedido}</p>
        </div>

        {/* Estado actual */}
        <div className={`${estadoInfo.bgColor} rounded-lg p-6 mb-6 text-center`}>
          <Icon size={64} className={`${estadoInfo.color} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold ${estadoInfo.color} mb-2`}>
            {estadoInfo.label}
          </h2>
          <p className="text-gray-700">{estadoInfo.description}</p>
          {pedido.tiempoEstimado && pedido.estado !== 'entregado' && (
            <p className="text-sm text-gray-600 mt-2">
              Tiempo estimado: {pedido.tiempoEstimado} minutos
            </p>
          )}
        </div>

        {/* Detalles del pedido */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Pedido</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{pedido.clienteNombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tipo de entrega:</span>
              <span className="font-medium capitalize">{pedido.tipoEntrega}</span>
            </div>
            {pedido.numeroMesa && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mesa:</span>
                <span className="font-medium">{pedido.numeroMesa}</span>
              </div>
            )}
            {pedido.direccionEntrega && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-medium">{pedido.direccionEntrega}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Items</h4>
            <div className="space-y-2">
              {pedido.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.cantidad}x {item.producto?.nombre}
                  </span>
                  <span className="font-medium">${item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">${pedido.total}</span>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate(`/menu/${localId}`)}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default SeguimientoPedidoPage;
