'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Shield, User, Mail, Lock, Building, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombreLocal: '',
    slugLocal: ''
  });

  useEffect(() => {
    checkSetupNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSetupNeeded = async () => {
    try {
      const response = await axios.get('/api/setup/check');
      if (!response.data.setupNeeded) {
        // Ya hay usuarios, redirigir al login
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking setup:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generar el slug del local
    if (name === 'nombreLocal') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slugLocal: slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/setup/initialize', {
        superadmin: {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        },
        local: formData.nombreLocal ? {
          nombre: formData.nombreLocal,
          slug: formData.slugLocal
        } : null
      });

      toast.success('¡Configuración inicial completada!');
      
      // Esperar un toque y redirigir al login
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);

    } catch (error) {
      console.error('Error en setup:', error);
      toast.error(error.response?.data?.error || 'Error al configurar la aplicación');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Configuración Inicial
          </h1>
          <p className="text-gray-600">
            Bienvenido a Cartita. Configura tu cuenta de superadministrador para comenzar.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Superadmin */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-primary" />
                Datos del Superadministrador
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="admin@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            </div>

            {/* Datos del Local (Opcional) */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building size={24} className="text-primary" />
                Primer Local (Opcional)
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Puedes crear tu primer local ahora o hacerlo más tarde desde el panel de administración.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del local
                  </label>
                  <input
                    type="text"
                    name="nombreLocal"
                    value={formData.nombreLocal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mi Restaurante"
                  />
                </div>

                {formData.nombreLocal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del menú
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">/menu/</span>
                      <input
                        type="text"
                        name="slugLocal"
                        value={formData.slugLocal}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="mi-restaurante"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tu menú estará en: /menu/{formData.slugLocal || 'mi-restaurante'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Configurando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Completar Configuración</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Esta configuración solo se realiza una vez. Podrás crear más usuarios y locales desde el panel de administración.
        </p>
      </div>
    </div>
  );
}
