import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// SEGURIDAD: JWT_SECRET es obligatorio
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

export function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token no proporcionado', status: 401 };
    }

    const token = authHeader.substring(7);
    
    // Validar longitud del token para prevenir ataques
    if (token.length > 500) {
      return { error: 'Token inválido', status: 401 };
    }
    
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Solo permitir HS256
      maxAge: '7d' // Validar expiración
    });
    
    // Validar estructura del token
    if (!decoded.id || !decoded.email || !decoded.rol) {
      return { error: 'Token inválido', status: 401 };
    }
    
    return { user: decoded };
  } catch (error) {
    // No loguear el error completo por seguridad
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expirado', status: 401 };
    }
    return { error: 'Token inválido', status: 401 };
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const auth = verifyToken(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    // Agregar usuario al context
    const enhancedContext = {
      ...context,
      user: auth.user
    };
    
    return handler(request, enhancedContext);
  };
}

export function requireRole(...roles) {
  return (handler) => {
    return async (request, context) => {
      const auth = verifyToken(request);
      
      if (auth.error) {
        return NextResponse.json(
          { error: auth.error },
          { status: auth.status }
        );
      }

      if (!roles.includes(auth.user.rol)) {
        return NextResponse.json(
          { error: 'No tienes permisos para esta acción' },
          { status: 403 }
        );
      }

      // Agregar usuario al context
      const enhancedContext = {
        ...context,
        user: auth.user
      };
      
      return handler(request, enhancedContext);
    };
  };
}
