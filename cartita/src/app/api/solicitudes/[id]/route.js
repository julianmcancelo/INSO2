import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';

// GET - Traer solicitud o invitación
export const GET = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const getInvitacion = searchParams.get('invitacion');

    // Si piden la invitación
    if (getInvitacion === 'true') {
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

      const invitacion = await prisma.invitacion.findFirst({
        where: { email: solicitud.email },
        orderBy: { createdAt: 'desc' }
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
    }

    // Si no, devolver la solicitud
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) }
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      solicitud
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener datos' },
      { status: 500 }
    );
  }
});

// PUT - Actualizar estado de solicitud (solo superadmin)
export const PUT = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;
    const { estado, notas } = await request.json();

    // Validar el estado
    const estadosValidos = ['pendiente', 'aceptada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Actualizar la solicitud
    const solicitud = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: {
        estado
      }
    });

    // TODO: Si la aceptan, enviar email con invitación
    // TODO: Si la rechazan, enviar email de notificación

    return NextResponse.json({
      success: true,
      solicitud,
      message: `Solicitud ${estado} correctamente`
    });

  } catch (error) {
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar solicitud' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar solicitud (solo superadmin)
export const DELETE = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;

    await prisma.solicitud.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Solicitud eliminada correctamente'
    });

  } catch (error) {
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar solicitud' },
      { status: 500 }
    );
  }
});
