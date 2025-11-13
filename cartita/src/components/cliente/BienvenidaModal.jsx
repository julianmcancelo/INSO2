'use client';

import { useState } from 'react';
import { User, Phone, Package, Bike, MapPin, Home } from 'lucide-react';
import DireccionAutocomplete from './DireccionAutocomplete';

const BienvenidaModal = ({ local, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    tipoEntrega: '',
    direccion: '',
    referencia: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipoEntrega = (tipo) => {
    setFormData(prev => ({ ...prev, tipoEntrega: tipo }));
    
    if (tipo === 'takeaway') {
      // Si es take away, no necesita dirección, ir directo al menú
      onComplete({ ...formData, tipoEntrega: tipo });
    } else {
      // Si es delivery, pedir dirección
      setStep(3);
    }
  };

  const handleSubmitDatos = (e) => {
    e.preventDefault();
    if (!formData.nombreCliente.trim() || !formData.telefonoCliente.trim()) {
      return;
    }
    setStep(2);
  };

  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (!formData.direccion.trim()) {
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-primary to-orange-500 p-8 text-white text-center">
          {local.logoBase64 && (
            <img 
              src={local.logoBase64} 
              alt={local.nombre}
              className="h-20 w-20 object-contain mx-auto mb-4 bg-white rounded-full p-2"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido!</h1>
          <p className="text-red-100 text-lg">{local.nombre}</p>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {step === 1 && (
            <form onSubmit={handleSubmitDatos} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Comenzá tu pedido
                </h2>
                <p className="text-gray-600">
                  Necesitamos algunos datos para continuar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="telefonoCliente"
                  value={formData.telefonoCliente}
                  onChange={handleInputChange}
                  placeholder="+54 11 1234-5678"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
              >
                <span>Continuar</span>
                <span>→</span>
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  ¿Cómo querés recibir tu pedido?
                </h2>
                <p className="text-gray-600">
                  Elegí el método de entrega
                </p>
              </div>

              <button
                onClick={() => handleTipoEntrega('takeaway')}
                className="w-full bg-white border-2 border-gray-300 hover:border-primary hover:bg-red-50 rounded-xl p-6 transition group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary bg-opacity-10 p-4 rounded-full group-hover:bg-opacity-20 transition">
                    <Package size={32} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Take Away
                    </h3>
                    <p className="text-sm text-gray-600">
                      Retiro en el local
                    </p>
                  </div>
                  <span className="text-primary text-2xl">→</span>
                </div>
              </button>

              <button
                onClick={() => handleTipoEntrega('delivery')}
                className="w-full bg-white border-2 border-gray-300 hover:border-primary hover:bg-red-50 rounded-xl p-6 transition group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary bg-opacity-10 p-4 rounded-full group-hover:bg-opacity-20 transition">
                    <Bike size={32} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Delivery
                    </h3>
                    <p className="text-sm text-gray-600">
                      Envío a tu domicilio
                    </p>
                  </div>
                  <span className="text-primary text-2xl">→</span>
                </div>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                ← Volver
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitDireccion} className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  ¿A dónde enviamos tu pedido?
                </h2>
                <p className="text-gray-600">
                  Ingresá tu dirección de entrega
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home size={16} className="inline mr-1" />
                  Dirección Completa *
                </label>
                <DireccionAutocomplete
                  value={formData.direccion}
                  onChange={(value) => setFormData(prev => ({ ...prev, direccion: value }))}
                  placeholder="Buscar dirección en el mapa..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleInputChange}
                  placeholder="Ej: Casa azul, timbre 3B"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
              >
                <span>Ver Menú</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                ← Volver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BienvenidaModal;
