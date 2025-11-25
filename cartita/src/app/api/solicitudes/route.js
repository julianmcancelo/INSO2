import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enviarEmailConfirmacionSolicitud } from '@/lib/email';
import { logInfo, logError } from '@/lib/logger';

// POST - Crear solicitud desde landing page
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombreNegocio,
      nombreContacto,
      email,
      telefono,
      tipoNegocio,
      mensaje
    } = body;

    // Validaciones
    if (!nombreNegocio || !nombreContacto || !email) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombreNegocio, nombreContacto, email' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Crear solicitud con Prisma
    const solicitud = await prisma.solicitud.create({
      data: {
        nombreNegocio,
        nombreContacto,
        email,
        telefono: telefono || null,
        tipoNegocio: tipoNegocio || null,
        mensaje: mensaje || null,
        estado: 'pendiente'
      }
    });

    // Enviar email de confirmación al cliente (sin bloquear)
    Promise.resolve().then(async () => {
      try {
        await enviarEmailConfirmacionSolicitud(solicitud.email, solicitud.nombreNegocio);
        logInfo('✅ Email de confirmación enviado a:', solicitud.email);
      } catch (emailError) {
        logError('⚠️  No se pudo enviar email de confirmación:', emailError.message);
      }
    }).catch(err => {
      logError('⚠️  Error en envío de email:', err.message);
    });

    // TODO: Enviar email de notificación al admin

    return NextResponse.json({
      success: true,
      solicitud,
      message: 'Solicitud enviada exitosamente. Te contactaremos pronto.'
    }, { status: 201 });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al enviar solicitud' },
      { status: 500 }
    );
  }
}

// GET - Obtener solicitudes (solo admin)
export async function GET(request) {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    return NextResponse.json({
      success: true,
      solicitudes
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener solicitudes' },
      { status: 500 }
    );
  }
}
