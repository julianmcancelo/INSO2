import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Restablecer contraseña con token
export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar token válido
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token,
        usado: false,
        expiraEn: {
          gte: new Date()
        }
      },
      include: {
        usuario: true
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 404 }
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y marcar token como usado
    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: resetToken.usuarioId },
        data: { password: hashedPassword }
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { usado: true }
      })
    ]);

    console.log('✅ Contraseña restablecida para:', resetToken.usuario.email);

    return NextResponse.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return NextResponse.json(
      { error: 'Error al restablecer contraseña' },
      { status: 500 }
    );
  }
}
