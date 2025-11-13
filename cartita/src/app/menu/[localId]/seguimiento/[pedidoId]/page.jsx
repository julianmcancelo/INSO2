'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, CheckCircle, Package, Truck, ArrowLeft } from 'lucide-react';
import { pedidoAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SeguimientoPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarPedido = useCallback(async () => {
    try {
      const response = await pedidoAPI.getById(params.pedidoId);
      setPedido(response.data.pedido);
    } catch (error) {
      console.error('Error al cargar pedido:', error);
    } finally {
      setLoading(false);
    }
  }, [params.pedidoId]);

  useEffect(() => {
    cargarPedido();
    
    // Socket.IO para actualizaciones en tiempo real
    const socket = getSocket();
    
    socket.emit('join-pedido', params.pedidoId);

    socket.on('estado-actualizado', (data) => {
      if (data.pedidoId === parseInt(params.pedidoId)) {
        setPedido(prev => ({ ...prev, estado: data.estado }));
      }
    });

    return () => {
      socket.emit('leave-pedido', params.pedidoId);
      socket.off('estado-actualizado');
    };
  }, [params.pedidoId, cargarPedido]);

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido no encontrado</h2>
          <button
            onClick={() => router.push(`/menu/${params.localId}`)}
            className="text-primary hover:underline"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = getEstadoInfo(pedido.estado);
  const IconoEstado = estadoInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => router.push(`/menu/${params.localId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Volver al menú
        </button>

        {/* Estado del pedido */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
          <div className={`w-24 h-24 ${estadoInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconoEstado className={estadoInfo.color} size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {estadoInfo.label}
          </h1>
          <p className="text-gray-600 mb-4">{estadoInfo.description}</p>
          
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Pedido #{pedido.numeroPedido}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Pedido</h2>
          
          <div className="space-y-4">
            {['pendiente', 'preparando', 'listo', 'entregado'].map((estado, index) => {
              const info = getEstadoInfo(estado);
              const Icon = info.icon;
              const isActive = pedido.estado === estado;
              const isPast = ['pendiente', 'preparando', 'listo', 'entregado'].indexOf(pedido.estado) > index;
              
              return (
                <div key={estado} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive || isPast ? info.bgColor : 'bg-gray-100'
                  }`}>
                    <Icon className={isActive || isPast ? info.color : 'text-gray-400'} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isActive || isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                      {info.label}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Actual
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Pedido</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{pedido.nombreCliente}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Teléfono:</span>
              <span className="font-medium">{pedido.telefonoCliente}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium capitalize">{pedido.tipoEntrega}</span>
            </div>
            {pedido.direccion && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-medium">{pedido.direccion}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
            <div className="space-y-2">
              {pedido.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.cantidad}x {item.producto?.nombre}</span>
                  <span className="font-medium">${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">${parseFloat(pedido.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
