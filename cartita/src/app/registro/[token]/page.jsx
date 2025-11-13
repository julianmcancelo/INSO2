'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Store, User, Mail, Lock, XCircle, Loader, ExternalLink, MapPin, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BrandLogo from '@/components/shared/BrandLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegistroPage({ params }) {
  const router = useRouter();
  const { token } = params;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitacion, setInvitacion] = useState(null);
  const [error, setError] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const addressInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [formData, setFormData] = useState({
    // Datos del local
    nombreLocal: '',
    slugLocal: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    emailLocal: '',
    
    // Datos del usuario admin
    nombreUsuario: '',
    emailUsuario: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    verificarInvitacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const verificarInvitacion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/invitaciones/${token}`);
      setInvitacion(response.data.invitacion);
      
      // Pre-llenar el email del usuario
      setFormData(prev => ({
        ...prev,
        emailUsuario: response.data.invitacion.email
      }));

      // Verificar si el email ya está registrado (solo informativo)
      try {
        const checkResponse = await axios.get(`${API_URL}/api/usuarios/check-email`, {
          params: { email: response.data.invitacion.email }
        });

        if (checkResponse.data.exists) {
          // Email ya registrado - mostrar banner informativo pero permitir continuar
          console.log('ℹ️ Email ya registrado, pero permitiendo crear nuevo local');
          setEmailExists(true);
        }
      } catch (checkError) {
        console.error('Error verificando email:', checkError);
        // Continuar normalmente si falla la verificación
      }
    } catch (error) {
      console.error('Error al verificar invitación:', error);
      setError(error.response?.data?.error || 'Invitación inválida o expirada');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generar slug del local
    if (name === 'nombreLocal') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slugLocal: slug }));
    }

    // Buscar direcciones cuando se escribe
    if (name === 'direccion' && value.length > 3) {
      searchAddress(value);
    } else if (name === 'direccion' && value.length <= 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }

    // Validar fortaleza de contraseña
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }

    // Validar coincidencia de contraseñas
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
    if (name === 'password' && formData.confirmPassword) {
      setPasswordMatch(value === formData.confirmPassword);
    }
  };

  const searchAddress = async (query) => {
    if (!query || query.length < 3) return;

    setSearchingAddress(true);

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
          countrycodes: 'ar'
        },
        headers: {
          'User-Agent': 'Cartita-App'
        }
      });

      setAddressSuggestions(response.data);
      setShowSuggestions(response.data.length > 0);
    } catch (error) {
      console.error('Error buscando dirección:', error);
    } finally {
      setSearchingAddress(false);
    }
  };

  const selectAddress = (suggestion) => {
    const address = suggestion.display_name;
    setFormData(prev => ({ ...prev, direccion: address }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🚀 Iniciando registro...');
    console.log('FormData:', formData);
    console.log('Email exists:', emailExists);

    // Validaciones básicas del local
    if (!formData.nombreLocal || !formData.slugLocal) {
      toast.error('Por favor completa los datos del local');
      return;
    }

    // Validaciones de usuario solo si el email NO existe
    if (!emailExists) {
      if (!formData.nombreUsuario || !formData.password) {
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
    }

    setSubmitting(true);

    try {
      console.log('📤 Enviando datos de registro...');
      const response = await axios.post(`${API_URL}/api/registro/completar`, {
        token,
        local: {
          nombre: formData.nombreLocal,
          slug: formData.slugLocal,
          descripcion: formData.descripcion,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.emailLocal
        },
        usuario: {
          nombre: formData.nombreUsuario,
          email: formData.emailUsuario,
          password: formData.password
        }
      });

      console.log('✅ Registro exitoso:', response.data);
      toast.success('¡Registro completado exitosamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);

    } catch (error) {
      console.error('❌ Error al completar registro:', error);
      console.error('❌ Error response:', error.response);
      toast.error(error.response?.data?.error || 'Error al completar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-600">Verificando invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isEmailRegistered = error.includes('ya está registrado');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isEmailRegistered ? 'bg-blue-100' : 'bg-red-100'
          }`}>
            {isEmailRegistered ? (
              <Mail className="text-blue-600" size={40} />
            ) : (
              <XCircle className="text-red-600" size={40} />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {isEmailRegistered ? 'Email Ya Registrado' : 'Invitación Inválida'}
          </h2>
          
          <p className="text-gray-600 mb-6 text-center">
            {error}
          </p>

          {isEmailRegistered ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={18} />
                  ¿Qué hacer?
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Inicia sesión con tu email y contraseña existente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Si olvidaste tu contraseña, usa &quot;Recuperar Contraseña&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Una vez dentro, podrás gestionar tu nuevo local</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/admin/login')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Ir a Iniciar Sesión
                </button>
                <button
                  onClick={() => router.push('/admin/recuperar-password')}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Recuperar Contraseña
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Volver al Inicio
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Compacto */}
        <div className="text-center mb-6">
          <BrandLogo size="md" showText={true} className="mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            ¡Bienvenido a Cartita!
          </h1>
          <p className="text-sm text-gray-600">
            Completa tu registro para comenzar
          </p>
        </div>

        {/* Info de invitación compacta */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle size={18} />
              <span className="font-medium">{invitacion?.email}</span>
            </div>
            <span className="text-xs text-green-700">
              Expira: {new Date(invitacion?.expiraEn).toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>

        {/* Progress Steps - Solo mostrar si NO existe el email */}
        {!emailExists && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= 1 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Datos del Local
                </span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep >= 2 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= 2 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Tu Cuenta
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all hover:shadow-2xl">
          {/* Banner informativo si el email ya existe */}
          {emailExists && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Email ya registrado - Agregando segundo local
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1.5">
                    <p><strong>Puedes continuar</strong> para agregar un nuevo local a tu cuenta.</p>
                    <p><strong>Importante:</strong> Usa la <span className="underline">misma contraseña</span> que ya tienes configurada.</p>
                    <p>Al iniciar sesión, podrás elegir qué local gestionar.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Datos del Local */}
            <div 
              className="transition-all duration-300"
              onFocus={() => setCurrentStep(1)}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg animate-pulse">
                  <Store className="text-primary" size={20} />
                </div>
                Datos de tu Local
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre del Local *
                  </label>
                  <input
                    type="text"
                    name="nombreLocal"
                    value={formData.nombreLocal}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Ej: La Pizzería de Mario"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL del Menú *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm whitespace-nowrap bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-300">/menu/</span>
                    <input
                      type="text"
                      name="slugLocal"
                      value={formData.slugLocal}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                      placeholder="la-pizzeria-de-mario"
                    />
                  </div>
                  {formData.slugLocal && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <ExternalLink size={12} />
                        Tu menú: <strong className="font-mono">/menu/{formData.slugLocal}</strong>
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Describe tu negocio..."
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={14} className="inline mr-1" />
                    Dirección
                  </label>
                  <div className="relative">
                    <input
                      ref={addressInputRef}
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (addressSuggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="Escribe tu dirección..."
                      autoComplete="off"
                    />
                    {searchingAddress && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                    {!searchingAddress && formData.direccion && (
                      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>

                  {/* Sugerencias */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectAddress(suggestion)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {suggestion.display_name.split(',')[0]}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {suggestion.display_name}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    💡 Escribe 3+ caracteres para buscar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="+54 11 1234-5678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email del Local
                  </label>
                  <input
                    type="email"
                    name="emailLocal"
                    value={formData.emailLocal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="contacto@tulocal.com"
                  />
                </div>
              </div>
            </div>

            {/* Datos del Usuario - Solo si el email NO existe */}
            {!emailExists && (
              <div 
                className="border-t pt-6 transition-all duration-300"
                onFocus={() => setCurrentStep(2)}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg animate-pulse">
                    <User className="text-blue-600" size={20} />
                  </div>
                  Tu Cuenta de Administrador
                </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleInputChange}
                    required={!emailExists}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="emailUsuario"
                    value={formData.emailUsuario}
                    onChange={handleInputChange}
                    required={!emailExists}
                    disabled
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📧 Email de tu invitación
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!emailExists}
                    minLength={6}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {formData.password && (
                    <div className="mt-2 animate-fade-in">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        passwordStrength <= 2 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {passwordStrength <= 2 ? '🔴 Débil' : passwordStrength <= 3 ? '🟡 Media' : '🟢 Fuerte'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!emailExists}
                      minLength={6}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary text-sm transition-all ${
                        passwordMatch === null
                          ? 'border-gray-300'
                          : passwordMatch
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                      placeholder="Repite la contraseña"
                    />
                    {passwordMatch !== null && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordMatch ? (
                          <CheckCircle size={18} className="text-green-600 animate-bounce" />
                        ) : (
                          <XCircle size={18} className="text-red-600 animate-shake" />
                        )}
                      </div>
                    )}
                  </div>
                  {passwordMatch === false && (
                    <p className="text-xs text-red-600 mt-1 animate-fade-in">
                      ❌ Las contraseñas no coinciden
                    </p>
                  )}
                  {passwordMatch === true && (
                    <p className="text-xs text-green-600 mt-1 animate-fade-in">
                      ✅ Las contraseñas coinciden
                    </p>
                  )}
                </div>
              </div>
              </div>
            )}

            {/* Botón Submit */}
            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Creando tu cuenta...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Completar Registro</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Al completar el registro, podrás acceder a tu panel de administración
        </p>
      </div>
    </div>
  );
}
