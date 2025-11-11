import React, { useState, useEffect } from 'react';
import { Settings, Save, Power, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminMantenimiento = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    mantenimientoActivo: false,
    fechaLanzamiento: '',
    mensajeMantenimiento: 'Estamos trabajando en mejoras para ofrecerte una mejor experiencia.'
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/configuracion/mantenimiento`);
      
      if (response.data.success) {
        const { mantenimiento } = response.data;
        setConfig({
          mantenimientoActivo: mantenimiento.activo || false,
          fechaLanzamiento: mantenimiento.fechaLanzamiento || '',
          mensajeMantenimiento: mantenimiento.mensaje || 'Estamos trabajando en mejoras para ofrecerte una mejor experiencia.'
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMantenimiento = () => {
    setConfig(prev => ({
      ...prev,
      mantenimientoActivo: !prev.mantenimientoActivo
    }));
  };

  const handleGuardar = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      // Guardar configuración de mantenimiento activo
      await axios.put(
        `${API_URL}/api/configuracion`,
        {
          clave: 'mantenimiento_activo',
          valor: config.mantenimientoActivo,
          tipo: 'boolean',
          descripcion: 'Indica si el modo mantenimiento está activo'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Guardar fecha de lanzamiento
      if (config.fechaLanzamiento) {
        await axios.put(
          `${API_URL}/api/configuracion`,
          {
            clave: 'fecha_lanzamiento',
            valor: config.fechaLanzamiento,
            tipo: 'date',
            descripcion: 'Fecha de lanzamiento para cuenta regresiva'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      // Guardar mensaje
      await axios.put(
        `${API_URL}/api/configuracion`,
        {
          clave: 'mensaje_mantenimiento',
          valor: config.mensajeMantenimiento,
          tipo: 'string',
          descripcion: 'Mensaje a mostrar en la página de mantenimiento'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Configuración guardada correctamente');
      
      // Si se activó el mantenimiento, recargar la página
      if (config.mantenimientoActivo) {
        toast.info('Recargando aplicación...', { autoClose: 1500 });
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-primary" size={32} />
            Modo Mantenimiento
          </h1>
          <p className="text-gray-600 mt-1">
            Activa el modo mantenimiento para mostrar una página personalizada a todos los usuarios
          </p>
        </div>
        <button
          onClick={handleGuardar}
          disabled={saving}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* Estado Actual */}
      <div className={`p-6 rounded-xl mb-8 border-2 ${
        config.mantenimientoActivo 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              config.mantenimientoActivo ? 'bg-red-200' : 'bg-green-200'
            }`}>
              <Power className={config.mantenimientoActivo ? 'text-red-600' : 'text-green-600'} size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estado: {config.mantenimientoActivo ? 'MODO MANTENIMIENTO ACTIVO' : 'Sistema Operativo'}
              </h3>
              <p className="text-sm text-gray-600">
                {config.mantenimientoActivo 
                  ? 'Los usuarios verán la página de mantenimiento'
                  : 'El sistema funciona normalmente'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggleMantenimiento}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              config.mantenimientoActivo
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {config.mantenimientoActivo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      {/* Formulario de Configuración */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fecha de Lanzamiento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Fecha de Lanzamiento</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Configura una fecha para mostrar una cuenta regresiva. Si no se especifica, se mostrará como página de mantenimiento regular.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora de Lanzamiento
          </label>
          <input
            type="datetime-local"
            name="fechaLanzamiento"
            value={config.fechaLanzamiento}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Consejo:</strong> Usa la cuenta regresiva para generar expectativa antes del lanzamiento oficial de Cartita.
            </p>
          </div>
        </div>

        {/* Mensaje Personalizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Mensaje Personalizado</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Personaliza el mensaje que verán los usuarios en la página de mantenimiento.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje
          </label>
          <textarea
            name="mensajeMantenimiento"
            value={config.mensajeMantenimiento}
            onChange={handleInputChange}
            rows={5}
            placeholder="Estamos trabajando en mejoras..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />

          <div className="mt-4 text-xs text-gray-500">
            {config.mensajeMantenimiento.length} / 250 caracteres
          </div>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
        <p className="text-sm text-gray-600 mb-6">
          Así se verá la página de mantenimiento para los usuarios:
        </p>
        
        <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 rounded-xl p-8 text-center">
          <div className="bg-white rounded-2xl p-8 inline-block max-w-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {config.fechaLanzamiento ? '¡Muy Pronto!' : 'En Mantenimiento'}
            </h2>
            <p className="text-gray-600 mb-4">
              {config.mensajeMantenimiento}
            </p>
            {config.fechaLanzamiento && (
              <div className="inline-flex space-x-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>
                  Lanzamiento: {new Date(config.fechaLanzamiento).toLocaleString('es-ES', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advertencia */}
      {config.mantenimientoActivo && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Advertencia:</strong> Al activar el modo mantenimiento, TODOS los usuarios (incluyendo admins) verán la página de mantenimiento. Solo tú como superadmin podrás acceder al panel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMantenimiento;
