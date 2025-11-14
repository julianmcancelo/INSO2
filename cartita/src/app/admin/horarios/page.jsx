'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Save, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { localAPI } from '@/lib/api';
import PrivateRoute from '@/components/shared/PrivateRoute';

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' }
];

export default function AdminHorarios() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [horarios, setHorarios] = useState({});

  useEffect(() => {
    cargarHorarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cargarHorarios = async () => {
    if (!user?.localId) return;
    
    try {
      setLoading(true);
      const response = await localAPI.getById(user.localId);
      let horariosActuales = response.data.local.horarioAtencion || {};

      // Puede venir como string JSON desde la base, lo parseamos si es necesario
      if (typeof horariosActuales === 'string') {
        try {
          horariosActuales = JSON.parse(horariosActuales);
        } catch (e) {
          horariosActuales = {};
        }
      }
      
      const horariosInicializados = {};
      diasSemana.forEach(dia => {
        horariosInicializados[dia.id] = horariosActuales[dia.id] || '09:00-22:00';
      });
      
      setHorarios(horariosInicializados);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      toast.error('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeHorario = (dia, valor) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: valor
    }));
  };

  const copiarATodos = (dia) => {
    const horarioCopiar = horarios[dia];
    const nuevosHorarios = {};
    
    diasSemana.forEach(d => {
      nuevosHorarios[d.id] = horarioCopiar;
    });
    
    setHorarios(nuevosHorarios);
    toast.info('Horario copiado a todos los días');
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

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={24} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Clock size={32} className="text-primary" />
                    Horarios de Atención
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Configura los horarios de apertura de tu local</p>
                </div>
              </div>
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
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
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Formato de horarios</h2>
                <p className="text-sm text-gray-600">
                  Usa el formato <code className="bg-gray-100 px-2 py-1 rounded">HH:MM-HH:MM</code> o escribe &quot;cerrado&quot; para días sin atención.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ejemplo: <code className="bg-gray-100 px-2 py-1 rounded">09:00-22:00</code> o 
                  <code className="bg-gray-100 px-2 py-1 rounded ml-2">09:00-14:00,18:00-22:00</code> (con descanso)
                </p>
              </div>

              <div className="space-y-4">
                {diasSemana.map(dia => (
                  <div key={dia.id} className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      {dia.nombre}
                    </label>
                    <input
                      type="text"
                      value={horarios[dia.id] || ''}
                      onChange={(e) => handleChangeHorario(dia.id, e.target.value)}
                      placeholder="09:00-22:00 o cerrado"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() => copiarATodos(dia.id)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                      title="Copiar a todos los días"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Los clientes verán si el local está abierto o cerrado en tiempo real</li>
                  <li>• Puedes usar el botón de copiar para aplicar el mismo horario a todos los días</li>
                  <li>• Para horarios con descanso, separa con coma: 09:00-14:00,18:00-22:00</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}
