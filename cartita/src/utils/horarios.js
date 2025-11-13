/**
 * Verifica si el local está abierto en el horario actual
 * @param {Object} horarioAtencion - Objeto con horarios por día
 * @returns {Object} - { abierto: boolean, mensaje: string }
 */
export function verificarHorarioActual(horarioAtencion) {
  if (!horarioAtencion || typeof horarioAtencion !== 'object') {
    return { abierto: true, mensaje: '' };
  }

  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();
  const tiempoActual = horaActual * 60 + minutosActuales;

  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaHoy = diasSemana[diaSemana];

  const horarioHoy = horarioAtencion[diaHoy];

  if (!horarioHoy || horarioHoy === 'cerrado' || horarioHoy === '') {
    return {
      abierto: false,
      mensaje: 'Cerrado hoy'
    };
  }

  // Parsear horario (formato: "09:00-22:00" o "09:00-14:00,18:00-22:00")
  const rangos = horarioHoy.split(',').map(r => r.trim());

  for (const rango of rangos) {
    const [inicio, fin] = rango.split('-').map(h => h.trim());
    
    if (!inicio || !fin) continue;

    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);

    const tiempoInicio = horaInicio * 60 + minInicio;
    const tiempoFin = horaFin * 60 + minFin;

    if (tiempoActual >= tiempoInicio && tiempoActual <= tiempoFin) {
      return {
        abierto: true,
        mensaje: `Abierto hasta las ${fin}`
      };
    }
  }

  return {
    abierto: false,
    mensaje: 'Cerrado en este momento'
  };
}

/**
 * Formatea el horario para mostrar
 * @param {Object} horarioAtencion 
 * @returns {Array} - Array de objetos con día y horario
 */
export function formatearHorario(horarioAtencion) {
  if (!horarioAtencion) return [];

  const diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return diasSemana.map(dia => ({
    dia: dia.label,
    horario: horarioAtencion[dia.key] || 'Cerrado'
  }));
}
