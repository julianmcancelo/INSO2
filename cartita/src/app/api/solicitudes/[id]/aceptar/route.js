import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import crypto from 'crypto';
import { enviarEmailInvitacion } from '@/lib/email';
import { logInfo, logError } from '@/lib/logger';

// POST - Aceptar solicitud y generar invitación
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

    if (solicitud.estado !== 'pendiente') {
      return NextResponse.json(
        { error: 'La solicitud ya fue procesada' },
        { status: 400 }
      );
    }

    // Generar un token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Fecha de vencimiento (7 días)
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    // Crear la invitación y actualizar la solicitud en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar la solicitud
      const solicitudActualizada = await tx.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'aceptada' }
      });

      // Crear la invitación
      const invitacion = await tx.invitacion.create({
        data: {
          token,
          email: solicitud.email,
          rol: 'admin',
          usado: false,
          expiraEn
        }
      });

      return { solicitud: solicitudActualizada, invitacion };
    });

    // Generar URL de invitación
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const invitacionUrl = `${baseUrl}/registro/${token}`;

    // Enviar email con el link de invitación (sin bloquear)
    Promise.resolve().then(async () => {
      try {
        await enviarEmailInvitacion(solicitud.email, token, solicitud.nombreNegocio);
        logInfo('✅ Email de invitación enviado a:', solicitud.email);
      } catch (emailError) {
        logError('⚠️  No se pudo enviar email de invitación:', emailError.message);
      }
    }).catch(err => {
      logError('⚠️  Error en envío de email:', err.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Solicitud aceptada, invitación generada y email enviado',
      invitacion: {
        token: result.invitacion.token,
        url: invitacionUrl,
        email: solicitud.email,
        expiraEn: result.invitacion.expiraEn
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
});
