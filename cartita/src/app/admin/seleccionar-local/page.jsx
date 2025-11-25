'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, ArrowRight, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import BrandLogo from '@/components/shared/BrandLogo';
import { logInfo, logError } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function SeleccionarLocalPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }
    loadLocales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadLocales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/locales`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      logInfo('Locales recibidos:', response.data.locales);

      // La API ya devuelve solo los locales accesibles
      const localesAccesibles = response.data.locales || [];

      setLocales(localesAccesibles);

      // Si solo tiene un local, redirigir automáticamente
      if (localesAccesibles.length === 1) {
        seleccionarLocal(localesAccesibles[0]);
      }
    } catch (error) {
      console.error('Error al cargar locales:', error);
      toast.error('Error al cargar locales');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarLocal = (local) => {
    logInfo('🏪 Seleccionando local:', local);
    logInfo('👤 Usuario actual:', user);
    
    // Actualizar el usuario con el local seleccionado
    const updatedUser = { 
      ...user, 
      localId: local.id,
      local: {
        id: local.id,
        nombre: local.nombre,
        slug: local.slug
      }
    };
    
    logInfo('✅ Usuario actualizado:', updatedUser);
    
    setUser(updatedUser);
    
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    logInfo('💾 Guardado en localStorage');
    
    toast.success(`Local "${local.nombre}" seleccionado`);
    
    // Forzar recarga completa de la página para actualizar todos los componentes
    setTimeout(() => {
      window.location.href = '/admin';
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando locales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BrandLogo size="md" showText={true} className="mx-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Selecciona un Local
          </h1>
          <p className="text-lg text-gray-600">
            Tienes acceso a {locales.length} {locales.length === 1 ? 'local' : 'locales'}
          </p>
        </div>

        {/* Locales Grid */}
        {locales.length === 0 ? (
          <div className="text-center py-12">
            <Store size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes locales asignados
            </h2>
            <p className="text-gray-600 mb-6">
              Contacta al administrador para que te asigne un local
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Volver al Login
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locales.map((local) => (
              <div
                key={local.id}
                onClick={() => seleccionarLocal(local)}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-primary hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
              >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      <Store size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1 truncate">
                      {local.nombre}
                    </h3>
                    <p className="text-sm text-white/80 font-mono">
                      /menu/{local.slug}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  {local.descripcion && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {local.descripcion}
                    </p>
                  )}

                  {local.direccion && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-1">{local.direccion}</span>
                    </div>
                  )}

                  {local.telefono && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="flex-shrink-0 text-gray-400" />
                      <span>{local.telefono}</span>
                    </div>
                  )}

                  {local.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="flex-shrink-0 text-gray-400" />
                      <span className="truncate">{local.email}</span>
                    </div>
                  )}

                  {/* Estado */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        local.activo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${local.activo ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        {local.activo ? 'Activo' : 'Inactivo'}
                      </span>

                      <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        <span>Seleccionar</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para cerrar sesión */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/admin/login');
            }}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
