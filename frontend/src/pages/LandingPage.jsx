import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, User, Phone, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    nombreNegocio: '',
    nombreContacto: '',
    email: '',
    telefono: '',
    tipoNegocio: '',
    mensaje: ''
  });

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Solicitud Recibida!
          </h2>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu solicitud para <strong>{formData.nombreNegocio}</strong>.
            Te contactaremos pronto a <strong>{formData.email}</strong> con los siguientes pasos.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Digitaliza tu <span className="text-primary">Restaurante</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema completo de menú digital con pedidos en tiempo real, gestión de productos y seguimiento de órdenes. 
              Todo lo que necesitas en una sola plataforma.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Store className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Menú Digital</h3>
              <p className="text-gray-600">
                Catálogo interactivo con fotos, descripciones y precios actualizados en tiempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-orange-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pedidos Online</h3>
              <p className="text-gray-600">
                Recibe y gestiona pedidos desde cualquier dispositivo con notificaciones instantáneas.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Local</h3>
              <p className="text-gray-600">
                Administra múltiples sucursales desde un solo panel de control centralizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-orange-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-1">Comienza Hoy</h2>
              <p className="text-red-100 text-sm">Completa el formulario y nos pondremos en contacto</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Store size={16} className="inline mr-1" />
                    Nombre del Negocio *
                  </label>
                  <input
                    type="text"
                    name="nombreNegocio"
                    value={formData.nombreNegocio}
                    onChange={handleInputChange}
                    onFocus={() => setExpanded(true)}
                    placeholder="Ej: Pizzería Roma"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>

                {expanded && (
                  <div className="space-y-4 animate-fadeIn">

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone size={16} className="inline mr-1" />
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+54 11 1234-5678"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Negocio
                        </label>
                        <select
                          name="tipoNegocio"
                          value={formData.tipoNegocio}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare size={16} className="inline mr-1" />
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos sobre tu negocio..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !expanded}
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Solicitud</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Al enviar, aceptas que nos pongamos en contacto contigo
              </p>
            </form>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-gray-600 hover:text-primary transition"
            >
              ¿Ya tienes una cuenta? <span className="font-semibold">Inicia Sesión</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
