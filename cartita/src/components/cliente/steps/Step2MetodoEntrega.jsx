'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Search, ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

// Importar mapa dinámicamente para evitar SSR issues
const MapaSelector = dynamic(() => import('../MapaSelector'), { ssr: false });

export default function Step2MetodoEntrega({ 
  pedidoData, 
  updatePedidoData, 
  goToNextStep,
  goToPrevStep 
}) {
  const [tipoEntrega, setTipoEntrega] = useState(pedidoData.tipoEntrega || null);
  const [direccionData, setDireccionData] = useState({
    direccion: pedidoData.direccion || '',
    latitud: pedidoData.latitud || null,
    longitud: pedidoData.longitud || null,
    referenciaDireccion: pedidoData.referenciaDireccion || ''
  });
  const [showMap, setShowMap] = useState(false);

  const handleTipoEntregaSelect = (tipo) => {
    setTipoEntrega(tipo);
    if (tipo === 'takeaway') {
      // Si es takeaway, puede continuar directamente
      updatePedidoData({ tipoEntrega: tipo });
    } else {
      // Si es envío, mostrar formulario de dirección
      setShowMap(true);
    }
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccionData(prev => ({ ...prev, [name]: value }));
  };

  const handleUbicacionSeleccionada = (ubicacion) => {
    setDireccionData({
      direccion: ubicacion.direccion,
      latitud: ubicacion.lat,
      longitud: ubicacion.lng,
      referenciaDireccion: direccionData.referenciaDireccion
    });
  };

  const handleContinue = () => {
    if (tipoEntrega === 'takeaway') {
      updatePedidoData({ 
        tipoEntrega,
        direccion: null,
        latitud: null,
        longitud: null,
        referenciaDireccion: null
      });
      toast.success('¡Genial! Ahora elige tus productos', {
        icon: '🛍️',
        position: 'bottom-center'
      });
      goToNextStep();
    } else if (tipoEntrega === 'envio') {
      if (!direccionData.direccion || !direccionData.latitud) {
        toast.error('Por favor selecciona tu dirección en el mapa');
        return;
      }
      updatePedidoData({ 
        tipoEntrega,
        ...direccionData
      });
      toast.success('¡Dirección confirmada! Ahora elige tus productos', {
        icon: '🛍️',
        position: 'bottom-center'
      });
      goToNextStep();
    } else {
      toast.error('Por favor selecciona un método de entrega');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-3 shadow-lg">
          <Truck className="text-white" size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Método de entrega
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Elegí cómo querés recibir tu pedido
        </p>
      </div>

      {/* Opciones de Entrega */}
      {!showMap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Take Away */}
          <button
            onClick={() => handleTipoEntregaSelect('takeaway')}
            className={`p-6 rounded-2xl border-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              tipoEntrega === 'takeaway'
                ? 'border-black bg-black text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                tipoEntrega === 'takeaway' ? 'bg-white/20' : 'bg-orange-100'
              }`}>
                <Package size={32} className={tipoEntrega === 'takeaway' ? 'text-white' : 'text-orange-600'} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Take Away</h3>
                <p className={`text-sm ${tipoEntrega === 'takeaway' ? 'text-white/80' : 'text-gray-600'}`}>
                  Retiro en el local
                </p>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${
                tipoEntrega === 'takeaway' ? 'bg-white/20' : 'bg-green-100 text-green-700'
              }`}>
                Sin cargo
              </div>
            </div>
          </button>

          {/* Envío */}
          <button
            onClick={() => handleTipoEntregaSelect('envio')}
            className={`p-6 rounded-2xl border-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              tipoEntrega === 'envio'
                ? 'border-black bg-black text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                tipoEntrega === 'envio' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <Truck size={32} className={tipoEntrega === 'envio' ? 'text-white' : 'text-blue-600'} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Envío</h3>
                <p className={`text-sm ${tipoEntrega === 'envio' ? 'text-white/80' : 'text-gray-600'}`}>
                  Te lo llevamos a tu domicilio
                </p>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${
                tipoEntrega === 'envio' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
              }`}>
                Delivery
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Formulario de Dirección (solo si eligió envío) */}
      {showMap && tipoEntrega === 'envio' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <MapPin size={18} className="flex-shrink-0 mt-0.5" />
              <span>
                Buscá tu dirección y seleccionala en el mapa para confirmar la ubicación exacta
              </span>
            </p>
          </div>

          {/* Mapa de selección */}
          <MapaSelector 
            onUbicacionSeleccionada={handleUbicacionSeleccionada}
            ubicacionInicial={direccionData.latitud ? {
              lat: parseFloat(direccionData.latitud),
              lng: parseFloat(direccionData.longitud),
              direccion: direccionData.direccion
            } : null}
          />

          {/* Dirección seleccionada */}
          {direccionData.direccion && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 md:p-4">
              <p className="text-xs md:text-sm font-semibold text-green-800 mb-1">
                Dirección seleccionada:
              </p>
              <p className="text-sm md:text-base text-green-900">{direccionData.direccion}</p>
            </div>
          )}

          {/* Referencia adicional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Home size={18} className="inline mr-2 text-gray-500" />
              Referencia (opcional)
            </label>
            <input
              type="text"
              name="referenciaDireccion"
              value={direccionData.referenciaDireccion}
              onChange={handleDireccionChange}
              placeholder="Ej: Casa azul, Depto 4B, Timbre rojo"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
            />
          </div>

          {/* Botón para cambiar método */}
          <button
            onClick={() => {
              setShowMap(false);
              setTipoEntrega(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Cambiar método de entrega
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={goToPrevStep}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={24} />
          Atrás
        </button>

        {tipoEntrega && (
          <button
            onClick={handleContinue}
            className="flex-[2] bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continuar
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
