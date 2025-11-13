'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BrandLogo from '@/components/shared/BrandLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RestablecerPasswordPage({ params }) {
  const router = useRouter();
  const { token } = params;
  
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    verificarToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      setPasswordStrength(strength);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const verificarToken = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/verificar-token-password/${token}`);
      setValidToken(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Token inválido o expirado');
      setValidToken(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/auth/restablecer-password`, {
        token,
        password
      });

      toast.success('¡Contraseña restablecida exitosamente!');
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al restablecer contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando token...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Token Inválido
          </h2>
          <p className="text-gray-600 mb-6">
            El enlace de recuperación es inválido o ha expirado.
            <br />
            Por favor solicita uno nuevo.
          </p>
          <button
            onClick={() => router.push('/admin/recuperar-password')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Solicitar Nuevo Enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <BrandLogo size="md" showText={true} className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="inline mr-1" />
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900 pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password strength */}
            {password && (
              <div className="mt-2">
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="inline mr-1" />
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary transition text-gray-900 pr-12 ${
                  passwordMatch === null
                    ? 'border-gray-300'
                    : passwordMatch
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {passwordMatch !== null && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  {passwordMatch ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : (
                    <XCircle size={18} className="text-red-600" />
                  )}
                </div>
              )}
            </div>
            {passwordMatch === false && (
              <p className="text-xs text-red-600 mt-1">
                ❌ Las contraseñas no coinciden
              </p>
            )}
            {passwordMatch === true && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Las contraseñas coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !passwordMatch}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Restableciendo...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Restablecer Contraseña
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
