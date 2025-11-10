import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Store } from 'lucide-react';
import { toast } from 'react-toastify';
import { invitationAPI } from '../services/api';

const RegisterByInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitacion, setInvitacion] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await invitationAPI.validateToken(token);
      setInvitacion(response.data.invitacion);
      
      // Si la invitación tiene email, pre-llenarlo
      if (response.data.invitacion.email) {
        setFormData(prev => ({ ...prev, email: response.data.invitacion.email }));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Invitación inválida o expirada');
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password) {
      toast.error('Todos los campos son requeridos');
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

    setSubmitting(true);

    try {
      await invitationAPI.completeRegistration(token, {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      toast.success('¡Registro completado exitosamente!');
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Error al completar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invitacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invitación Inválida</h2>
          <p className="text-gray-600">
            Esta invitación ha expirado o ya fue utilizada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header con info del local */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: invitacion.local?.colorPrimario || '#ef4444' }}
          >
            {invitacion.local?.logoBase64 ? (
              <img 
                src={invitacion.local.logoBase64} 
                alt={invitacion.local.nombre}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <Store className="text-white" size={40} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Te han invitado a unirte
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            {invitacion.local?.nombre}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Rol: <span className="font-semibold capitalize">{invitacion.rol}</span>
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Completa tu Registro
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                disabled={!!invitacion.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu contraseña"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Registrando...' : 'Completar Registro'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Al registrarte, aceptas formar parte del equipo de {invitacion.local?.nombre}
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterByInvitation;
