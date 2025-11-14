import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Verificar invitación por token
export async function GET(request, { params }) {
  try {
    const { token } = params;

    const invitacion = await prisma.invitacion.findUnique({
      where: { token }
    });

    if (!invitacion) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya fue usada
    if (invitacion.usado) {
      return NextResponse.json(
        { error: 'Esta invitación ya fue utilizada' },
        { status: 400 }
      );
    }

    // Verificar si expiró
    if (new Date() > new Date(invitacion.expiraEn)) {
      return NextResponse.json(
        { error: 'Esta invitación ha expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      invitacion: {
        email: invitacion.email,
        rol: invitacion.rol,
        expiraEn: invitacion.expiraEn
      }
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al verificar invitación' },
      { status: 500 }
    );
  }
}
