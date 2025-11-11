import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BrandLogo from '../../components/BrandLogo';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/password/forgot`, { email });
      
      setSubmitted(true);
      
      // Solo en desarrollo, mostrar el link
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
        console.log('🔑 Link de recuperación:', response.data.resetUrl);
      }

      toast.success('Revisa tu email para continuar');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¡Email Enviado!
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Si existe una cuenta con <strong>{email}</strong>, recibirás un email con instrucciones para recuperar tu contraseña.
          </p>

          {resetUrl && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">🔧 Modo Desarrollo:</p>
              <a 
                href={resetUrl} 
                className="text-xs text-blue-600 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {resetUrl}
              </a>
            </div>
          )}

          <Link
            to="/admin/login"
            className="inline-flex items-center space-x-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft size={18} />
            <span>Volver al login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size="md" showText={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Ingresa tu email y te enviaremos instrucciones para recuperarla.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                'Enviar instrucciones'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={16} />
              <span>Volver al login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
