import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Verificar si un email ya está registrado
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuarios con ese email (puede haber múltiples)
    const usuarios = await prisma.usuario.findMany({
      where: { email },
      select: { id: true, email: true, nombre: true },
      take: 1 // Solo necesitamos saber si existe al menos uno
    });

    return NextResponse.json({
      exists: usuarios.length > 0,
      user: usuarios.length > 0 ? {
        email: usuarios[0].email,
        nombre: usuarios[0].nombre
      } : null
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al verificar email' },
      { status: 500 }
    );
  }
}
