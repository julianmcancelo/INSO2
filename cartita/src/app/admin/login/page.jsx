'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, QrCode, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/shared/BrandLogo';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
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

      if (result.success && result.user) {
        toast.success('¡Bienvenido!');
        
        // Si el usuario no tiene localId asignado (admin de múltiples locales o superadmin)
        // redirigir a seleccionar local
        if (!result.user.localId && result.user.rol !== 'superadmin') {
          router.push('/admin/seleccionar-local');
        } else {
          router.push('/admin');
        }
      } else {
        toast.error(result?.error || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 relative overflow-hidden items-center justify-center p-8 xl:p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Floating decorative cards - solo en pantallas grandes */}
        <div className="hidden xl:block absolute top-10 left-10 animate-float">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30">
            <div className="text-white">
              <QrCode className="w-8 h-8 mb-1" />
              <div className="text-xs">Menú digital</div>
            </div>
          </div>
        </div>
        <div className="hidden xl:block absolute bottom-10 right-10 animate-float delay-1000">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30">
            <div className="text-white">
              <Zap className="w-8 h-8 mb-1" />
              <div className="text-xs">Pedidos online</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          {/* Logo */}
          <div className="mb-8">
            <BrandLogo size="xl" showText={true} />
          </div>

          {/* Main headline */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Administrá tu <br />
            <span className="text-yellow-300">restaurante</span>
          </h2>
          
          <p className="text-lg xl:text-xl text-white/90 mb-8 leading-relaxed">
            Gestiona tu menú, recibe pedidos y <br />
            controlá tu negocio desde un solo lugar.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all hover:scale-105">
              <QrCode className="w-8 h-8 text-yellow-300 mb-2 mx-auto" />
              <div className="text-xs font-medium">Catálogo digital</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all hover:scale-105">
              <Zap className="w-8 h-8 text-yellow-300 mb-2 mx-auto" />
              <div className="text-xs font-medium">Pedidos instantáneos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all hover:scale-105">
              <BarChart3 className="w-8 h-8 text-yellow-300 mb-2 mx-auto" />
              <div className="text-xs font-medium">Análisis en tiempo real</div>
            </div>
          </div>

          {/* Visual elements */}
          <div className="flex justify-center gap-3 mb-8">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-600"></div>
          </div>

          {/* Simple CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <p className="text-sm font-medium mb-1">Ingresá al panel de administración</p>
            <p className="text-xs text-white/80">Gestioná tu restaurante y menú desde aquí</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
        
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <BrandLogo size="md" showText={true} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Accede al panel de administración
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-lg text-base font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => router.push('/admin/recuperar-password')}
              className="text-sm text-primary hover:text-orange-600 font-medium transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
