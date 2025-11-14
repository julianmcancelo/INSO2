import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { checkRateLimit, isValidEmail } from '@/lib/security';

// SEGURIDAD: JWT_SECRET es obligatorio
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Rate limiting por IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitCheck = checkRateLimit(`login:${ip}`, 5, 60000); // 5 intentos por minuto
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Validación de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar longitud de password
    if (password.length < 6 || password.length > 100) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Buscar usuarios con ese email (puede haber múltiples con diferentes locales)
    const usuarios = await prisma.usuario.findMany({
      where: { email },
      include: {
        local: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      }
    });

    // Siempre devolver el mismo mensaje para no revelar si el email existe
    if (usuarios.length === 0) {
      // Simular tiempo de procesamiento para prevenir timing attacks
      await bcrypt.compare('dummy', '$2a$10$dummyhashfordummypasswordprotection');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña con el primer usuario (todos deberían tener la misma)
    let user = null;
    for (const u of usuarios) {
      const isValidPassword = await bcrypt.compare(password, u.password);
      if (isValidPassword && u.activo) {
        user = u;
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token con algoritmo seguro
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol,
        localId: user.localId 
      },
      JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256' // Especificar algoritmo explícitamente
      }
    );

    // Retornar usuario sin password
    const { password: _, ...usuarioSinPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      usuario: {
        ...usuarioSinPassword,
        local: user.local
      }
    });

  } catch (error) {
    // No loguear detalles del error por seguridad en producción
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
