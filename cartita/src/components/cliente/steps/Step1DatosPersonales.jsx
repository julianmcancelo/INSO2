'use client';

import { useState, useEffect } from 'react';
import { User, Phone, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Step1DatosPersonales({ 
  pedidoData, 
  updatePedidoData, 
  goToNextStep 
}) {
  const [formData, setFormData] = useState({
    nombreCliente: pedidoData.nombreCliente || '',
    telefonoCliente: pedidoData.telefonoCliente || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCliente.trim()) {
      newErrors.nombreCliente = 'Por favor ingresa tu nombre';
    } else if (formData.nombreCliente.trim().length < 3) {
      newErrors.nombreCliente = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.telefonoCliente.trim()) {
      newErrors.telefonoCliente = 'Por favor ingresa tu WhatsApp';
    } else if (!/^\d{10,15}$/.test(formData.telefonoCliente.replace(/\s/g, ''))) {
      newErrors.telefonoCliente = 'Ingresa un número válido (10-15 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      updatePedidoData(formData);
      toast.success('¡Perfecto! Ahora elige cómo recibir tu pedido', {
        icon: '👍',
        position: 'bottom-center'
      });
      goToNextStep();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-3 shadow-lg">
          <User className="text-white" size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tus datos
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Necesitamos tu información para el pedido
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Nombre Completo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User size={18} className="inline mr-2 text-gray-500" />
            Nombre completo
          </label>
          <input
            type="text"
            name="nombreCliente"
            value={formData.nombreCliente}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ej: Juan Pérez"
            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-black/5 transition-all text-lg ${
              errors.nombreCliente
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-black'
            }`}
            autoFocus
          />
          {errors.nombreCliente && (
            <p className="mt-2 text-sm text-red-600">
              {errors.nombreCliente}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone size={18} className="inline mr-2 text-gray-500" />
            WhatsApp
          </label>
          <input
            type="tel"
            name="telefonoCliente"
            value={formData.telefonoCliente}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ej: 1234567890"
            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-black/5 transition-all text-lg ${
              errors.telefonoCliente
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-black'
            }`}
          />
          {errors.telefonoCliente && (
            <p className="mt-2 text-sm text-red-600">
              {errors.telefonoCliente}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Te contactaremos por WhatsApp para coordinar tu pedido
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
      >
        Continuar
        <ChevronRight size={24} />
      </button>

      {/* Info Card */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4 mt-6">
        <p className="text-xs md:text-sm text-blue-800">
          Tus datos están seguros y solo se usan para procesar tu pedido
        </p>
      </div>
    </div>
  );
}
