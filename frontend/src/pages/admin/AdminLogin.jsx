import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, BarChart3, Users, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/BrandLogo';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(`¡Bienvenido ${result.usuario.nombre}!`);
        navigate('/admin');
      } else {
        // Manejo específico de error 429
        if (result.status === 429 || result.error?.includes('Demasiados intentos')) {
          toast.error(
            '⏱️ Demasiados intentos de inicio de sesión. Por favor, espera unos minutos e intenta nuevamente.',
            { autoClose: 5000 }
          );
        } else {
          toast.error(result.error || 'Credenciales incorrectas');
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejo específico de error 429
      if (error.response?.status === 429) {
        toast.error(
          '⏱️ Demasiados intentos de inicio de sesión. Por favor, espera 15 minutos e intenta nuevamente.',
          { autoClose: 5000 }
        );
      } else {
        toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Lado Izquierdo - Ilustración y Beneficios */}
      <div className="hidden md:flex md:w-1/2 bg-white p-6 lg:p-12 flex-col justify-center">
        <div className="max-w-lg">
          {/* Ilustración */}
          <div className="mb-12">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Monitor */}
              <rect x="80" y="80" width="240" height="160" rx="8" fill="none" stroke="#EF4444" strokeWidth="3" />
              <rect x="90" y="90" width="220" height="130" rx="4" fill="#FEF3C7" />
              
              {/* Plato de comida en monitor */}
              <circle cx="130" cy="140" r="25" fill="#FBBF24" />
              <circle cx="200" cy="140" r="25" fill="#FB923C" />
              <circle cx="270" cy="140" r="25" fill="#EF4444" />
              
              {/* Tenedor y cuchillo */}
              <line x1="50" y1="120" x2="50" y2="180" stroke="#EF4444" strokeWidth="3" />
              <line x1="45" y1="125" x2="50" y2="125" stroke="#EF4444" strokeWidth="3" />
              <line x1="45" y1="135" x2="50" y2="135" stroke="#EF4444" strokeWidth="3" />
              
              <line x1="350" y1="120" x2="350" y2="180" stroke="#EF4444" strokeWidth="3" />
              <path d="M345 125 L350 130 L355 125" fill="none" stroke="#EF4444" strokeWidth="3" />
              
              {/* Base del monitor */}
              <rect x="180" y="240" width="40" height="30" fill="#EF4444" />
              <rect x="150" y="270" width="100" height="8" rx="4" fill="#EF4444" />
            </svg>
          </div>

          {/* Título y Descripción */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Transforma tu negocio con
            <span className="block mt-2">
              <span className="text-gray-900">Carti</span><span className="text-primary">ta</span>
            </span>
          </h1>

          {/* Beneficios */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Monitorea tu desempeño y accede a información valiosa para mejorar las ventas y tener clientes leales.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="text-orange-500" size={24} />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Gestiona pedidos en tiempo real y mantén a tus clientes informados con notificaciones instantáneas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Mantén tu menú, horarios de apertura y toda información de tu local actualizada al instante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario de Login */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-md w-full">
          {/* Logo y selector de idioma */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
            <BrandLogo size="md" showText={true} />
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>ES</span>
            </button>
          </div>

          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Inicia sesión con tu correo electrónico
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Olvidaste contraseña */}
            <div className="flex justify-end">
              <Link
                to="/admin/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">O</span>
              </div>
            </div>

            {/* Google Login (deshabilitado por ahora) */}
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center space-x-3 py-3 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">Iniciar sesión con Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
