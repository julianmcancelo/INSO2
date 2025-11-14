import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Verificar si un token de recuperación es válido
export async function GET(request, { params }) {
  try {
    const { token } = params;

    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token,
        usado: false,
        expiraEn: {
          gte: new Date()
        }
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al verificar token' },
      { status: 500 }
    );
  }
}
