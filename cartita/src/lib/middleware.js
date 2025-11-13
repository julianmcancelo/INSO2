import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro';

export function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token no proporcionado', status: 401 };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return { user: decoded };
  } catch (error) {
    console.error('Error verificando token:', error);
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
