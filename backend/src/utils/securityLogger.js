const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const securityLogFile = path.join(logsDir, 'security.log');

/**
 * Registra eventos de seguridad
 */
const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  // Escribir en archivo
  fs.appendFile(securityLogFile, logLine, (err) => {
    if (err) {
      console.error('Error al escribir log de seguridad:', err);
    }
  });

  // También mostrar en consola en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 [SECURITY]', event, details);
  }
};

/**
 * Registra intentos de login fallidos
 */
const logFailedLogin = (email, ip, reason = 'Credenciales inválidas') => {
  logSecurityEvent('FAILED_LOGIN', {
    email,
    ip,
    reason
  });
};

/**
 * Registra logins exitosos
 */
const logSuccessfulLogin = (userId, email, ip) => {
  logSecurityEvent('SUCCESSFUL_LOGIN', {
    userId,
    email,
    ip
  });
};

/**
 * Registra intentos de acceso no autorizado
 */
const logUnauthorizedAccess = (userId, resource, ip) => {
  logSecurityEvent('UNAUTHORIZED_ACCESS', {
    userId,
    resource,
    ip
  });
};

/**
 * Registra cambios de contraseña
 */
const logPasswordChange = (userId, email, ip) => {
  logSecurityEvent('PASSWORD_CHANGE', {
    userId,
    email,
    ip
  });
};

/**
 * Registra creación de usuarios
 */
const logUserCreation = (createdBy, newUserId, newUserEmail, ip) => {
  logSecurityEvent('USER_CREATED', {
    createdBy,
    newUserId,
    newUserEmail,
    ip
  });
};

/**
 * Registra eliminación de usuarios
 */
const logUserDeletion = (deletedBy, deletedUserId, ip) => {
  logSecurityEvent('USER_DELETED', {
    deletedBy,
    deletedUserId,
    ip
  });
};

/**
 * Registra tokens inválidos o expirados
 */
const logInvalidToken = (token, ip, reason) => {
  logSecurityEvent('INVALID_TOKEN', {
    tokenPreview: token ? token.substring(0, 20) + '...' : 'null',
    ip,
    reason
  });
};

/**
 * Registra rate limit excedido
 */
const logRateLimitExceeded = (ip, endpoint) => {
  logSecurityEvent('RATE_LIMIT_EXCEEDED', {
    ip,
    endpoint
  });
};

module.exports = {
  logSecurityEvent,
  logFailedLogin,
  logSuccessfulLogin,
  logUnauthorizedAccess,
  logPasswordChange,
  logUserCreation,
  logUserDeletion,
  logInvalidToken,
  logRateLimitExceeded
};
