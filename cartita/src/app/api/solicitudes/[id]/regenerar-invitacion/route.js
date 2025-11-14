import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import crypto from 'crypto';
import { enviarEmailInvitacion } from '@/lib/email';

// POST - Regenerar invitación para una solicitud aceptada
export const POST = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;

    // Traer la solicitud
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
        { error: 'Solo se pueden regenerar invitaciones de solicitudes aceptadas' },
        { status: 400 }
      );
    }

    // Buscar la invitación anterior
    const invitacionAnterior = await prisma.invitacion.findFirst({
      where: {
        email: solicitud.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Verificar si ya la usaron
    if (invitacionAnterior?.usado) {
      return NextResponse.json(
        { error: 'Esta invitación ya fue utilizada. El usuario ya completó su registro.' },
        { status: 400 }
      );
    }

    // Generar un nuevo token
    const nuevoToken = crypto.randomBytes(32).toString('hex');
    
    // Nueva fecha de vencimiento (7 días)
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    // Marcar la invitación anterior como vencida (si existe) y crear una nueva
    const result = await prisma.$transaction(async (tx) => {
      // Si existe invitación anterior sin usar, marcarla como vencida
      if (invitacionAnterior && !invitacionAnterior.usado) {
        await tx.invitacion.update({
          where: { id: invitacionAnterior.id },
          data: {
            expiraEn: new Date() // Vencerla inmediatamente
          }
        });
      }

      // Crear nueva invitación
      const nuevaInvitacion = await tx.invitacion.create({
        data: {
          token: nuevoToken,
          email: solicitud.email,
          rol: 'admin',
          usado: false,
          expiraEn
        }
      });

      return nuevaInvitacion;
    });

    // Generar URL de invitación
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const invitacionUrl = `${baseUrl}/registro/${nuevoToken}`;

    // Enviar email con el nuevo link (sin bloquear)
    Promise.resolve().then(async () => {
      try {
        await enviarEmailInvitacion(solicitud.email, nuevoToken, solicitud.nombreNegocio);
      } catch (emailError) {
        // Silenciar error de email
      }
    }).catch(err => {
      // Silenciar error
    });

    return NextResponse.json({
      success: true,
      message: 'Nueva invitación generada y enviada',
      invitacion: {
        token: result.token,
        url: invitacionUrl,
        email: solicitud.email,
        expiraEn: result.expiraEn
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al regenerar invitación' },
      { status: 500 }
    );
  }
});
