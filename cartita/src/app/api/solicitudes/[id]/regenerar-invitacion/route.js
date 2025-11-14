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
    console.log('🔑 Nuevo token generado:', nuevoToken.substring(0, 16) + '...');
    
    // Nueva fecha de vencimiento (7 días)
    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + 7);
    console.log('⏰ Expira en:', expiraEn);

    // Marcar la invitación anterior como vencida (si existe) y crear una nueva
    console.log('📝 Iniciando transacción...');
    const result = await prisma.$transaction(async (tx) => {
      // Si existe invitación anterior sin usar, marcarla como vencida
      if (invitacionAnterior && !invitacionAnterior.usado) {
        console.log('⏰ Expirando invitación anterior:', invitacionAnterior.id);
        await tx.invitacion.update({
          where: { id: invitacionAnterior.id },
          data: {
            expiraEn: new Date() // Vencerla inmediatamente
          }
        });
      }

      // Crear nueva invitación
      console.log('✨ Creando nueva invitación...');
      const nuevaInvitacion = await tx.invitacion.create({
        data: {
          token: nuevoToken,
          email: solicitud.email,
          rol: 'admin',
          usado: false,
          expiraEn
        }
      });
      console.log('✅ Nueva invitación creada:', nuevaInvitacion.id);

      return nuevaInvitacion;
    });
    console.log('✅ Transacción completada');

    // Generar URL de invitación
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const invitacionUrl = `${baseUrl}/registro/${nuevoToken}`;

    // Enviar email con el nuevo link
    Promise.resolve().then(async () => {
      try {
        await enviarEmailInvitacion(solicitud.email, nuevoToken, solicitud.nombreNegocio);
        console.log('✅ Email de invitación reenviado a:', solicitud.email);
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar email:', emailError.message);
      }
    }).catch(err => console.warn('⚠️ Error en envío de email:', err.message));

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
    console.error('Error al regenerar invitación:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: 'Error al regenerar invitación: ' + error.message },
      { status: 500 }
    );
  }
});
