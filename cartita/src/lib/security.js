/**
 * Utilidades de seguridad para validación y sanitización de datos
 */

/**
 * Sanitizar string para prevenir XSS
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validar email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validar password
 */
export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  
  return password.length >= 6 && password.length <= 100;
}

/**
 * Validar slug (solo letras minúsculas, números y guiones)
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * Validar teléfono (formato flexible)
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  
  // Permitir números, espacios, guiones, paréntesis y el signo +
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 8 && phone.length <= 20;
}

/**
 * Validar que un valor sea un número entero positivo
 */
export function isPositiveInteger(value) {
  const num = parseInt(value);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
}

/**
 * Validar que un valor sea un número decimal positivo
 */
export function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Sanitizar objeto eliminando propiedades peligrosas
 */
export function sanitizeObject(obj, allowedKeys) {
  if (!obj || typeof obj !== 'object') return {};
  
  const sanitized = {};
  
  for (const key of allowedKeys) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
}

/**
 * Validar que una imagen base64 sea válida
 */
export function isValidBase64Image(base64String) {
  if (!base64String || typeof base64String !== 'string') return false;
  
  // Verificar que empiece con data:image/
  if (!base64String.startsWith('data:image/')) return false;
  
  // Verificar tamaño (máximo 5MB)
  const sizeInBytes = (base64String.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return sizeInBytes <= maxSize;
}

/**
 * Rate limiting simple en memoria (para desarrollo)
 * En producción usar Redis o similar
 */
const rateLimitStore = new Map();

export function checkRateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Limpiar requests antiguos
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: validRequests[0] + windowMs
    };
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  
  return {
    allowed: true,
    remainingRequests: maxRequests - validRequests.length,
    resetTime: now + windowMs
  };
}

/**
 * Limpiar rate limit store periódicamente
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(timestamp => now - timestamp < 60000);
    if (validRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, validRequests);
    }
  }
}, 60000); // Cada minuto

/**
 * Generar token seguro
 */
export function generateSecureToken(length = 32) {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validar que un valor esté en una lista permitida
 */
export function isInWhitelist(value, whitelist) {
  return whitelist.includes(value);
}
