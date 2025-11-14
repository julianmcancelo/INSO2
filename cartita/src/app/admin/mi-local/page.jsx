'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, Save, MapPin, Phone, Mail, Clock, Palette, Image as ImageIcon, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/shared/PrivateRoute';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function MiLocalPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const addressInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    colorPrimario: '#FF6B35',
    colorSecundario: '#004E89',
    logoBase64: '',
    horarioAtencion: {
      lunes: '09:00-22:00',
      martes: '09:00-22:00',
      miercoles: '09:00-22:00',
      jueves: '09:00-22:00',
      viernes: '09:00-23:00',
      sabado: '10:00-23:00',
      domingo: '10:00-22:00'
    }
  });

  useEffect(() => {
    if (user?.localId) {
      loadLocalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.localId]);

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

  const loadLocalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/locales/${user.localId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const localData = response.data.local;
      setLocal(localData);

      // Aseguramos que horarioAtencion sea siempre un objeto (puede venir como string JSON desde la API)
      let horarioAtencionParsed = localData.horarioAtencion;
      if (typeof horarioAtencionParsed === 'string') {
        try {
          horarioAtencionParsed = JSON.parse(horarioAtencionParsed);
        } catch (e) {
          horarioAtencionParsed = null;
        }
      }

      setFormData({
        nombre: localData.nombre || '',
        slug: localData.slug || '',
        descripcion: localData.descripcion || '',
        direccion: localData.direccion || '',
        telefono: localData.telefono || '',
        email: localData.email || '',
        colorPrimario: localData.colorPrimario || '#FF6B35',
        colorSecundario: localData.colorSecundario || '#004E89',
        logoBase64: localData.logoBase64 || '',
        horarioAtencion: horarioAtencionParsed || {
          lunes: '09:00-22:00',
          martes: '09:00-22:00',
          miercoles: '09:00-22:00',
          jueves: '09:00-22:00',
          viernes: '09:00-23:00',
          sabado: '10:00-23:00',
          domingo: '10:00-22:00'
        }
      });
    } catch (error) {
      console.error('Error al cargar local:', error);
      toast.error('Error al cargar datos del local');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Buscar direcciones cuando se escribe en el campo de dirección
    if (name === 'direccion' && value.length > 3) {
      searchAddress(value);
    } else if (name === 'direccion' && value.length <= 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const searchAddress = async (query) => {
    if (!query || query.length < 3) return;

    setSearchingAddress(true);

    try {
      // Usar Nominatim de OpenStreetMap
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
          countrycodes: 'ar' // Limitar a Argentina, puedes cambiarlo
        },
        headers: {
          'User-Agent': 'Cartita-App' // Requerido por Nominatim
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

  const handleHorarioChange = (dia, valor) => {
    setFormData(prev => ({
      ...prev,
      horarioAtencion: {
        ...prev.horarioAtencion,
        [dia]: valor
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe superar 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoBase64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.slug) {
      toast.error('Nombre y slug son requeridos');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/locales/${user.localId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Local actualizado correctamente');
      loadLocalData();
    } catch (error) {
      console.error('Error al actualizar local:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar local');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  if (!user?.localId) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <Store size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Local Asignado</h2>
            <p className="text-gray-600 mb-6">
              No tienes un local asignado. Contacta al administrador.
            </p>
            <Link
              href="/admin"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={24} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mi Local</h1>
                  <p className="text-sm text-gray-600 mt-1">Gestiona la información de tu negocio</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Información Básica */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="text-primary" size={24} />
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Local *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /menu/{formData.slug}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-primary" size={24} />
                Información de Contacto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
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
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Escribe tu dirección..."
                      autoComplete="off"
                    />
                    {searchingAddress && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      </div>
                    )}
                    {!searchingAddress && formData.direccion && (
                      <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>

                  {/* Sugerencias de direcciones */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectAddress(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="mt-1 flex-shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.display_name.split(',')[0]}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {suggestion.display_name}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    💡 Escribe al menos 3 caracteres para buscar direcciones
                  </p>
                </div>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="text-primary" size={24} />
                Logo del Local
              </h2>

              <div className="flex items-center gap-6">
                {formData.logoBase64 && (
                  <div className="flex-shrink-0">
                    <img
                      src={formData.logoBase64}
                      alt="Logo"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tamaño máximo: 2MB. Formatos: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            {/* Colores */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="text-primary" size={24} />
                Colores de Marca
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorPrimario"
                      value={formData.colorPrimario}
                      onChange={handleInputChange}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.colorPrimario}
                      onChange={(e) => setFormData(prev => ({ ...prev, colorPrimario: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="colorSecundario"
                      value={formData.colorSecundario}
                      onChange={handleInputChange}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.colorSecundario}
                      onChange={(e) => setFormData(prev => ({ ...prev, colorSecundario: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={24} />
                Horarios de Atención
              </h2>

              <div className="space-y-3">
                {Object.keys(formData.horarioAtencion).map((dia) => (
                  <div key={dia} className="flex items-center gap-4">
                    <label className="w-24 text-sm font-medium text-gray-700 capitalize">
                      {dia}
                    </label>
                    <input
                      type="text"
                      value={formData.horarioAtencion[dia]}
                      onChange={(e) => handleHorarioChange(dia, e.target.value)}
                      placeholder="09:00-22:00"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Formato: HH:MM-HH:MM (ejemplo: 09:00-22:00)
              </p>
            </div>

            {/* Botón Guardar */}
            <div className="flex justify-end gap-4">
              <Link
                href="/admin"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </PrivateRoute>
  );
}
