import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { verificarHorarioActual, formatearHorarios } from '../../utils/horarios';

const HorarioStatus = ({ horarioAtencion }) => {
  const [estado, setEstado] = useState(null);
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  useEffect(() => {
    // Verificar horario inicial
    const estadoActual = verificarHorarioActual(horarioAtencion);
    setEstado(estadoActual);

    // Actualizar cada minuto
    const interval = setInterval(() => {
      const nuevoEstado = verificarHorarioActual(horarioAtencion);
      setEstado(nuevoEstado);
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, [horarioAtencion]);

  if (!estado) return null;

  const horarios = formatearHorarios(horarioAtencion);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Estado actual */}
      <div 
        className={`p-4 cursor-pointer transition ${
          estado.abierto 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100' 
            : 'bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100'
        }`}
        onClick={() => setMostrarHorarios(!mostrarHorarios)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              estado.abierto ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Clock size={20} className={estado.abierto ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${
                  estado.abierto ? 'text-green-700' : 'text-red-700'
                }`}>
                  {estado.abierto ? '🟢 Abierto' : '🔴 Cerrado'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">
                {estado.mensaje}
              </p>
              {!estado.abierto && estado.proximaApertura && (
                <p className="text-xs text-gray-500 mt-1">
                  Próxima apertura: {estado.proximaApertura}
                </p>
              )}
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition">
            {mostrarHorarios ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Lista de horarios */}
      {mostrarHorarios && (
        <div className="p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Horarios de atención</h4>
          <div className="space-y-2">
            {horarios.map((h, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-white transition"
              >
                <span className="text-sm font-medium text-gray-700">{h.dia}</span>
                <span className={`text-sm ${
                  h.cerrado ? 'text-red-600 font-medium' : 'text-gray-900'
                }`}>
                  {h.texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advertencia si está cerrado */}
      {!estado.abierto && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-100">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ Puedes ver el menú pero no realizar pedidos en este momento
          </p>
        </div>
      )}
    </div>
  );
};

export default HorarioStatus;
