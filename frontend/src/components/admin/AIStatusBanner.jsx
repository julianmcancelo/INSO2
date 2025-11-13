import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import aiService from '../../services/aiService';

/**
 * Banner para mostrar el estado del servicio de IA
 * Se muestra en el dashboard de administrador
 */
const AIStatusBanner = () => {
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrar, setMostrar] = useState(true);

  useEffect(() => {
    verificarEstado();
  }, []);

  const verificarEstado = async () => {
    try {
      const response = await aiService.verificarEstadoIA();
      setEstado(response.data);
    } catch (error) {
      console.error('Error al verificar estado de IA:', error);
      setEstado({ configurado: false, mensaje: 'Error al verificar servicio' });
    } finally {
      setLoading(false);
    }
  };

  const cerrarBanner = () => {
    setMostrar(false);
    // Guardar en localStorage para no mostrar por 24 horas
    localStorage.setItem('ai_banner_closed', Date.now().toString());
  };

  // No mostrar si se cerró recientemente (últimas 24 horas)
  useEffect(() => {
    const closed = localStorage.getItem('ai_banner_closed');
    if (closed) {
      const timePassed = Date.now() - parseInt(closed);
      const hours24 = 24 * 60 * 60 * 1000;
      if (timePassed < hours24) {
        setMostrar(false);
      }
    }
  }, []);

  if (loading || !mostrar) return null;

  // Si está configurado y funcionando, mostrar banner de éxito
  if (estado?.configurado) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-900 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                IA Activada - DeepSeek
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                {estado.mensaje}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ✨ Descripciones automáticas
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  💡 Sugerencias inteligentes
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  💬 Chatbot de menú
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={cerrarBanner}
            className="flex-shrink-0 text-purple-400 hover:text-purple-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Si no está configurado, mostrar banner informativo
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900">
              Potencia tu menú con IA
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Activa DeepSeek AI para generar descripciones automáticas, sugerencias inteligentes y más.
            </p>
            <div className="mt-3">
              <a
                href="/DEEPSEEK_INTEGRATION.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Ver cómo activar
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={cerrarBanner}
          className="flex-shrink-0 text-blue-400 hover:text-blue-600"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AIStatusBanner;
