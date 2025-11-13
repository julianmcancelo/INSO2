'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import BrandLogo from '@/components/shared/BrandLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar API de recuperación de contraseña
      // await authAPI.forgotPassword(email);
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Email enviado! Revisa tu bandeja de entrada');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Enviado
          </h2>
          <p className="text-gray-600 mb-6">
            Hemos enviado un link de recuperación a <strong>{email}</strong>.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link
            href="/admin/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size="lg" showText={true} />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos un link para recuperarla
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              'Enviar Link de Recuperación'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
