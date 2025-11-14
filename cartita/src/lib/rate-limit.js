/**
 * Rate Limiting Middleware Mejorado
 * Protección contra ataques de fuerza bruta y DDoS
 */

import { NextResponse } from 'next/server';

// Store en memoria (en producción usar Redis)
const rateLimitStore = new Map();

// Limpiar store cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate Limiter configurable
 */
export function rateLimit(options = {}) {
  const {
    maxRequests = 100,      // Máximo de requests
    windowMs = 60000,       // Ventana de tiempo (1 minuto)
    keyGenerator = (req) => req.headers.get('x-forwarded-for') || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
  } = options;

  return async (request, handler) => {
    const key = keyGenerator(request);
    const now = Date.now();
    
    // Obtener o crear entrada
    let record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
        firstRequest: now
      };
      rateLimitStore.set(key, record);
    }
    
    // Incrementar contador
    record.count++;
    
    // Verificar límite
    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter: retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      );
    }
    
    // Ejecutar handler
    const response = await handler(request);
    
    // Agregar headers de rate limit
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - record.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    
    return response;
  };
}

/**
 * Rate limiters predefinidos
 */
export const rateLimiters = {
  // Muy estricto - Login, registro
  strict: rateLimit({
    maxRequests: 5,
    windowMs: 60000, // 1 minuto
    message: 'Demasiados intentos. Espera 1 minuto.'
  }),
  
  // Moderado - Endpoints de escritura
  moderate: rateLimit({
    maxRequests: 30,
    windowMs: 60000, // 1 minuto
    message: 'Demasiadas solicitudes. Espera un momento.'
  }),
  
  // Permisivo - Endpoints de lectura
  permissive: rateLimit({
    maxRequests: 100,
    windowMs: 60000, // 1 minuto
    message: 'Límite de solicitudes alcanzado.'
  }),
  
  // Email - Envío de correos
  email: rateLimit({
    maxRequests: 3,
    windowMs: 300000, // 5 minutos
    message: 'Demasiados emails enviados. Espera 5 minutos.'
  })
};
