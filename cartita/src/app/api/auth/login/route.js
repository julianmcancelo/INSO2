import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
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

    if (usuarios.length === 0) {
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

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        rol: user.rol,
        localId: user.localId 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
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
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
