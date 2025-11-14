import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';

// GET - Obtener invitación de una solicitud aceptada
export const GET = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;

    // Buscar solicitud
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) }
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    if (solicitud.estado !== 'aceptada') {
      return NextResponse.json(
        { error: 'Esta solicitud no ha sido aceptada' },
        { status: 400 }
      );
    }

    // Buscar invitación asociada
    const invitacion = await prisma.invitacion.findFirst({
      where: {
        email: solicitud.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!invitacion) {
      return NextResponse.json(
        { error: 'No se encontró invitación para esta solicitud' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const invitacionUrl = `${baseUrl}/registro/${invitacion.token}`;

    return NextResponse.json({
      success: true,
      invitacion: {
        token: invitacion.token,
        url: invitacionUrl,
        email: invitacion.email,
        usado: invitacion.usado,
        expiraEn: invitacion.expiraEn,
        createdAt: invitacion.createdAt
      }
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener invitación' },
      { status: 500 }
    );
  }
});
