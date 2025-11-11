import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { localAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' }
];

const AdminHorarios = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(null);
  const [horarios, setHorarios] = useState({});

  useEffect(() => {
    cargarLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarLocal = async () => {
    try {
      setLoading(true);
      const response = await localAPI.getById(user.localId);
      setLocal(response.data.local);
      
      // Inicializar horarios o usar los existentes
      const horariosActuales = response.data.local.horarioAtencion || {};
      const horariosInicializados = {};
      
      diasSemana.forEach(dia => {
        horariosInicializados[dia.id] = horariosActuales[dia.id] || {
          abierto: false,
          apertura: '09:00',
          cierre: '18:00',
          descanso: false,
          inicioDescanso: '13:00',
          finDescanso: '15:00'
        };
      });
      
      setHorarios(horariosInicializados);
    } catch (error) {
      console.error('Error al cargar local:', error);
      toast.error('Error al cargar información del local');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDia = (dia) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        abierto: !prev[dia].abierto
      }
    }));
  };

  const handleToggleDescanso = (dia) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        descanso: !prev[dia].descanso
      }
    }));
  };

  const handleChangeHorario = (dia, campo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor
      }
    }));
  };

  const handleGuardar = async () => {
    try {
      setSaving(true);
      await localAPI.update(user.localId, {
        horarioAtencion: horarios
      });
      toast.success('Horarios actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      toast.error('Error al guardar horarios');
    } finally {
      setSaving(false);
    }
  };

  const copiarATodasLosDias = (dia) => {
    const horarioCopiar = horarios[dia];
    const nuevosHorarios = {};
    
    diasSemana.forEach(d => {
      nuevosHorarios[d.id] = { ...horarioCopiar };
    });
    
    setHorarios(nuevosHorarios);
    toast.info('Horario copiado a todos los días');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!local) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la información del local</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="mr-3 text-primary" size={32} />
            Horarios de Atención
          </h1>
          <p className="text-gray-600 mt-1">Configura los horarios de apertura de tu local</p>
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

      {/* Horarios por día */}
      <div className="space-y-4">
        {diasSemana.map(dia => (
          <div key={dia.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={horarios[dia.id]?.abierto || false}
                    onChange={() => handleToggleDia(dia.id)}
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="ml-3 text-lg font-semibold text-gray-900">{dia.nombre}</span>
                </label>
                
                {!horarios[dia.id]?.abierto && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    Cerrado
                  </span>
                )}
              </div>

              {horarios[dia.id]?.abierto && (
                <button
                  onClick={() => copiarATodasLosDias(dia.id)}
                  className="text-sm text-primary hover:underline"
                >
                  Copiar a todos los días
                </button>
              )}
            </div>

            {horarios[dia.id]?.abierto && (
              <div className="space-y-4 ml-8">
                {/* Horario principal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apertura
                    </label>
                    <input
                      type="time"
                      value={horarios[dia.id]?.apertura || '09:00'}
                      onChange={(e) => handleChangeHorario(dia.id, 'apertura', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cierre
                    </label>
                    <input
                      type="time"
                      value={horarios[dia.id]?.cierre || '18:00'}
                      onChange={(e) => handleChangeHorario(dia.id, 'cierre', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Descanso */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={horarios[dia.id]?.descanso || false}
                      onChange={() => handleToggleDescanso(dia.id)}
                      className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Horario de descanso (siesta)
                    </span>
                  </label>
                </div>

                {horarios[dia.id]?.descanso && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inicio descanso
                      </label>
                      <input
                        type="time"
                        value={horarios[dia.id]?.inicioDescanso || '13:00'}
                        onChange={(e) => handleChangeHorario(dia.id, 'inicioDescanso', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fin descanso
                      </label>
                      <input
                        type="time"
                        value={horarios[dia.id]?.finDescanso || '15:00'}
                        onChange={(e) => handleChangeHorario(dia.id, 'finDescanso', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Previsualización */}
      <div className="mt-8 bg-gradient-to-br from-primary/5 to-orange-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
        <div className="space-y-2">
          {diasSemana.map(dia => {
            const horario = horarios[dia.id];
            if (!horario?.abierto) {
              return (
                <div key={dia.id} className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">{dia.nombre}</span>
                  <span className="text-red-600 font-medium">Cerrado</span>
                </div>
              );
            }

            return (
              <div key={dia.id} className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">{dia.nombre}</span>
                <span className="text-gray-900">
                  {horario.apertura} - {horario.cierre}
                  {horario.descanso && (
                    <span className="text-gray-500 ml-2">
                      (descanso {horario.inicioDescanso} - {horario.finDescanso})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminHorarios;
