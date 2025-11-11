import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPin } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoAdmin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ilustración 404 */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-primary opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="text-primary animate-bounce" size={80} />
          </div>
        </div>

        {/* Título y Descripción */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¡Página no encontrada!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
          <p className="text-sm text-gray-500">
            Ruta: <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        {/* Tarjetas de sugerencias */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <Search className="text-orange-500 mx-auto mb-3" size={40} />
            <h3 className="font-semibold text-gray-900 mb-1">Verifica la URL</h3>
            <p className="text-sm text-gray-600">
              Puede que hayas escrito mal la dirección
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <Home className="text-blue-500 mx-auto mb-3" size={40} />
            <h3 className="font-semibold text-gray-900 mb-1">Vuelve al Inicio</h3>
            <p className="text-sm text-gray-600">
              Comienza de nuevo desde la página principal
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <ArrowLeft className="text-green-500 mx-auto mb-3" size={40} />
            <h3 className="font-semibold text-gray-900 mb-1">Regresa Atrás</h3>
            <p className="text-sm text-gray-600">
              Vuelve a la página anterior
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            <Home size={20} />
            <span>Ir al Inicio</span>
          </button>

          <button
            onClick={handleGoBack}
            className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border border-gray-300"
          >
            <ArrowLeft size={20} />
            <span>Volver Atrás</span>
          </button>

          <button
            onClick={handleGoAdmin}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            <span>Panel Admin</span>
          </button>
        </div>

        {/* Footer con emoji */}
        <div className="mt-12 text-gray-500">
          <p className="text-6xl mb-4">🍕</p>
          <p className="text-sm">
            ¿Perdido? No te preocupes, ¡incluso los mejores chefs se pierden a veces!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
