'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Phone, MessageSquare, CheckCircle, ArrowRight, QrCode, Zap, TrendingUp, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BrandLogo from '@/components/shared/BrandLogo';
import PhoneMockup from '@/components/shared/PhoneMockup';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const LandingPage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [formData, setFormData] = useState({
    nombreNegocio: '',
    nombreContacto: '',
    email: '',
    telefono: '',
    tipoNegocio: '',
    mensaje: ''
  });

  // Verificar si necesita setup al cargar
  useEffect(() => {
    checkSetupNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSetupNeeded = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/setup/check`);
      if (response.data.setupNeeded) {
        // Redirigir a setup si no hay usuarios
        router.push('/setup');
      }
    } catch (error) {
      console.error('Error checking setup:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombreNegocio || !formData.nombreContacto || !formData.email) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/solicitudes`, formData);
      setSubmitted(true);
      toast.success('¡Solicitud enviada! Te contactaremos pronto.');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras verifica setup
  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¡Solicitud Recibida!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Hemos recibido tu solicitud para <strong>{formData.nombreNegocio}</strong>.
            Te contactaremos pronto a <strong>{formData.email}</strong> con los siguientes pasos.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <BrandLogo size="sm" showText={true} />
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.nombre?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.nombre}</span>
                <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-orange-600 font-medium mt-1 capitalize">{user.rol}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/admin');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        toast.success('Sesión cerrada correctamente');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push('/admin/login')}
              className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-100 transition border border-gray-300"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 relative overflow-hidden pt-20 sm:pt-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 md:py-32 grid md:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold animate-bounce">
              Digitaliza tu negocio en minutos
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="inline-block animate-fade-in">Tu restaurante</span>
              <br />
              <span className="text-yellow-300 inline-block animate-fade-in animation-delay-200 bg-clip-text">
                100% digital
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 text-white/90 animate-fade-in animation-delay-400">
              Menú QR, pedidos online y mucho más
            </p>

            {/* Features rápidas */}
            <div className="flex flex-wrap gap-3 mb-8 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle size={18} className="text-yellow-300" />
                <span className="text-sm font-medium">Sin apps</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle size={18} className="text-yellow-300" />
                <span className="text-sm font-medium">Setup en 5 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle size={18} className="text-yellow-300" />
                <span className="text-sm font-medium">Sin permanencia</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input principal */}
                <div className="bg-white rounded-xl p-1.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
                  <input
                    type="text"
                    name="nombreNegocio"
                    value={formData.nombreNegocio}
                    onChange={handleInputChange}
                    placeholder="¿Cómo se llama tu negocio?"
                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 text-gray-900 text-base sm:text-lg focus:outline-none rounded-lg"
                    onFocus={() => setShowForm(true)}
                    required
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Empezar</span>
                        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Formulario expandible */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Completa tus datos</h3>
                      <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <User size={16} className="inline mr-1" />
                          Tu Nombre *
                        </label>
                        <input
                          type="text"
                          name="nombreContacto"
                          value={formData.nombreContacto}
                          onChange={handleInputChange}
                          placeholder="Nombre completo"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Mail size={16} className="inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Phone size={16} className="inline mr-1" />
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+54 11 1234-5678"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Negocio
                        </label>
                        <select
                          name="tipoNegocio"
                          value={formData.tipoNegocio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                        >
                          <option value="">Selecciona...</option>
                          <option value="restaurante">Restaurante</option>
                          <option value="cafeteria">Cafetería</option>
                          <option value="pizzeria">Pizzería</option>
                          <option value="hamburgueseria">Hamburguesería</option>
                          <option value="parrilla">Parrilla</option>
                          <option value="bar">Bar</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MessageSquare size={16} className="inline mr-1" />
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos sobre tu negocio..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                      />
                    </div>

                    <p className="text-center text-xs text-gray-500">
                      Al enviar, aceptas que nos pongamos en contacto contigo
                    </p>
                  </div>
                </div>
              </form>

              <p className="text-white/80 text-xs sm:text-sm text-center">
                Sin permanencia • Prueba gratis 30 días
              </p>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="relative hidden md:flex items-center justify-center">
            <PhoneMockup />
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Digitaliza tu restaurante en minutos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <QrCode className="text-primary w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Menú QR</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                Clientes escanean el código QR y ven tu menú completo al instante. Actualízalo en tiempo real.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="text-orange-500 w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Pedidos Rápidos</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                Recibe pedidos directo en tu dispositivo. Notificaciones en tiempo real y gestión simple.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrendingUp className="text-green-600 w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Crece tu Negocio</h3>
              <p className="text-gray-600 text-base sm:text-lg">
                Estadísticas de ventas, productos más pedidos y análisis para tomar mejores decisiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Armado con ♥ por el equipo de Ingeniería 2
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
