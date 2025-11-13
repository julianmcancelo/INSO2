'use client';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { verificarHorarioActual } from '@/utils/horarios';

const HorarioStatus = ({ horarioAtencion }) => {
  if (!horarioAtencion) return null;

  const { abierto, mensaje } = verificarHorarioActual(horarioAtencion);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      abierto ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {abierto ? (
        <>
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Abierto ahora</span>
        </>
      ) : (
        <>
          <XCircle size={18} />
          <span className="text-sm font-medium">Cerrado</span>
        </>
      )}
      {mensaje && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-xs">{mensaje}</span>
        </>
      )}
    </div>
  );
};

export default HorarioStatus;
