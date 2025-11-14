'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AsistentePedido from '@/components/cliente/AsistentePedido';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function MenuPage() {
  const params = useParams();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.localId]);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      
      // Cargar los datos del local
      const localResponse = await axios.get(`${API_URL}/api/locales/slug/${params.localId}`);
      const localData = localResponse.data.local;
      setLocal(localData);
    } catch (error) {
      console.error('Error cargando menú:', error);
      toast.error('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handlePedidoComplete = (pedido) => {
    // El asistente ya redirige automáticamente
    // Esta función se puede usar para analytics o tracking
  };

  if (loading) {
    return <LoadingSpinner message="Cargando menú..." />;
  }

  if (!local) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Local no encontrado</h2>
          <p className="text-gray-600">El local que buscas no existe</p>
        </div>
      </div>
    );
  }

  return (
    <AsistentePedido 
      local={local}
      onComplete={handlePedidoComplete}
    />
  );
}
