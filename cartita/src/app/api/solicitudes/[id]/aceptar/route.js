import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';
import crypto from 'crypto';
import { enviarEmailInvitacion } from '@/lib/email';

// POST - Aceptar solicitud y generar invitación
export const POST = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;

    // Obtener solicitud
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

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Fecha de expiración (7 días)
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);

    // Crear invitación y actualizar solicitud en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar solicitud
      const solicitudActualizada = await tx.solicitud.update({
        where: { id: parseInt(id) },
        data: { estado: 'aceptada' }
      });

      // Crear invitación
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

    // Enviar email con el enlace de invitación (sin bloquear)
    Promise.resolve().then(async () => {
      try {
        await enviarEmailInvitacion(solicitud.email, token, solicitud.nombreNegocio);
        console.log('✅ Email de invitación enviado a:', solicitud.email);
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar email:', emailError.message);
      }
    }).catch(err => console.warn('⚠️ Error en envío de email:', err.message));

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
    console.error('Error al aceptar solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
});
