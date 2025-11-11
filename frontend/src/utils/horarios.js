/**
 * Utilidades para manejo de horarios de atención
 */

const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

/**
 * Verifica si el local está abierto en este momento
 * @param {Object} horarioAtencion - Objeto con horarios por día
 * @returns {Object} { abierto: boolean, mensaje: string, proximaApertura: string }
 */
export const verificarHorarioActual = (horarioAtencion) => {
  if (!horarioAtencion || Object.keys(horarioAtencion).length === 0) {
    return {
      abierto: true,
      mensaje: 'Horario no configurado',
      proximaApertura: null
    };
  }

  const ahora = new Date();
  const diaActual = diasSemana[ahora.getDay()];
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes(); // Minutos desde medianoche

  const horarioHoy = horarioAtencion[diaActual];

  if (!horarioHoy || !horarioHoy.abierto) {
    // Buscar próxima apertura
    const proximaApertura = buscarProximaApertura(horarioAtencion, ahora);
    return {
      abierto: false,
      mensaje: 'Cerrado hoy',
      proximaApertura
    };
  }

  // Convertir horarios a minutos
  const apertura = convertirHoraAMinutos(horarioHoy.apertura);
  const cierre = convertirHoraAMinutos(horarioHoy.cierre);

  // Verificar si está en horario de descanso
  if (horarioHoy.descanso) {
    const inicioDescanso = convertirHoraAMinutos(horarioHoy.inicioDescanso);
    const finDescanso = convertirHoraAMinutos(horarioHoy.finDescanso);

    if (horaActual >= inicioDescanso && horaActual < finDescanso) {
      return {
        abierto: false,
        mensaje: `En descanso. Abrimos a las ${horarioHoy.finDescanso}`,
        proximaApertura: `Hoy a las ${horarioHoy.finDescanso}`
      };
    }
  }

  // Verificar si está abierto
  if (horaActual >= apertura && horaActual < cierre) {
    return {
      abierto: true,
      mensaje: `Abierto hasta las ${horarioHoy.cierre}`,
      proximaApertura: null
    };
  }

  // Está cerrado
  if (horaActual < apertura) {
    return {
      abierto: false,
      mensaje: `Cerrado. Abrimos a las ${horarioHoy.apertura}`,
      proximaApertura: `Hoy a las ${horarioHoy.apertura}`
    };
  }

  // Ya cerró hoy
  const proximaApertura = buscarProximaApertura(horarioAtencion, ahora);
  return {
    abierto: false,
    mensaje: 'Cerrado',
    proximaApertura
  };
};

/**
 * Convierte una hora en formato HH:MM a minutos desde medianoche
 */
const convertirHoraAMinutos = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

/**
 * Busca la próxima apertura del local
 */
const buscarProximaApertura = (horarioAtencion, fechaActual) => {
  const diaActual = fechaActual.getDay();
  
  // Buscar en los próximos 7 días
  for (let i = 1; i <= 7; i++) {
    const diaBuscar = (diaActual + i) % 7;
    const nombreDia = diasSemana[diaBuscar];
    const horario = horarioAtencion[nombreDia];

    if (horario && horario.abierto) {
      const nombreDiaEs = getNombreDiaEspanol(nombreDia);
      if (i === 1) {
        return `Mañana a las ${horario.apertura}`;
      } else {
        return `${nombreDiaEs} a las ${horario.apertura}`;
      }
    }
  }

  return 'No disponible';
};

/**
 * Obtiene el nombre del día en español
 */
const getNombreDiaEspanol = (dia) => {
  const nombres = {
    'domingo': 'Domingo',
    'lunes': 'Lunes',
    'martes': 'Martes',
    'miercoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sabado': 'Sábado'
  };
  return nombres[dia] || dia;
};

/**
 * Formatea los horarios para mostrar
 */
export const formatearHorarios = (horarioAtencion) => {
  if (!horarioAtencion || Object.keys(horarioAtencion).length === 0) {
    return [];
  }

  return diasSemana.map(dia => {
    const horario = horarioAtencion[dia];
    const nombreDia = getNombreDiaEspanol(dia);

    if (!horario || !horario.abierto) {
      return {
        dia: nombreDia,
        texto: 'Cerrado',
        cerrado: true
      };
    }

    let texto = `${horario.apertura} - ${horario.cierre}`;
    
    if (horario.descanso) {
      texto += ` (descanso ${horario.inicioDescanso} - ${horario.finDescanso})`;
    }

    return {
      dia: nombreDia,
      texto,
      cerrado: false
    };
  });
};

/**
 * Verifica si el local acepta pedidos en este momento
 */
export const puedeRecibirPedidos = (horarioAtencion) => {
  const { abierto } = verificarHorarioActual(horarioAtencion);
  return abierto;
};
