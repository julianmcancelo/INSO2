/**
 * Sistema de logging seguro
 * Solo muestra logs en desarrollo, no en producción
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log de información (solo en desarrollo)
 */
export function logInfo(message, data = null) {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, data || '');
  }
}

/**
 * Log de error (siempre se registra pero sin detalles sensibles en producción)
 */
export function logError(message, error = null) {
  if (isDevelopment) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    // En producción solo loguear el mensaje, no el error completo
    console.error(`[ERROR] ${message}`);
  }
}

/**
 * Log de advertencia (solo en desarrollo)
 */
export function logWarn(message, data = null) {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, data || '');
  }
}

/**
 * Log de debug (solo en desarrollo)
 */
export function logDebug(message, data = null) {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
}

/**
 * Log de éxito (solo en desarrollo)
 */
export function logSuccess(message, data = null) {
  if (isDevelopment) {
    console.log(`[SUCCESS] ${message}`, data || '');
  }
}
