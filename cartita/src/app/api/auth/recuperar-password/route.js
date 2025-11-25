import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { enviarEmailRecuperacion } from '@/lib/email';

// POST - Solicitar recuperación de contraseña
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Buscar usuarios con ese email (puede haber múltiples)
    const usuarios = await prisma.usuario.findMany({
      where: { email }
    });

    // Por seguridad, siempre devolver éxito (no revelar si el email existe)
    if (usuarios.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación'
      });
    }

    // Generar token de recuperación
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEn = new Date();
    expiraEn.setHours(expiraEn.getHours() + 1); // Vence en 1 hora

    // Guardar el token para todos los usuarios con ese email
    for (const usuario of usuarios) {
      await prisma.passwordReset.create({
        data: {
          usuarioId: usuario.id,
          token,
          expiraEn
        }
      });
    }

    // Enviar el email (solo al primer usuario para evitar duplicados)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/admin/restablecer-password/${token}`;

    try {
      await enviarEmailRecuperacion(email, resetUrl, usuarios[0].nombre);
    } catch (emailError) {
      // No fallar la petición si el email falla
    }

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace de recuperación'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}
