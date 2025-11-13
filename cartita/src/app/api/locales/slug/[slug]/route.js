import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener local por slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const local = await prisma.local.findFirst({
      where: {
        slug,
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        direccion: true,
        telefono: true,
        email: true,
        logoBase64: true,
        colorPrimario: true,
        colorSecundario: true,
        horarioAtencion: true,
        activo: true
      }
    });

    if (!local) {
      return NextResponse.json(
        { error: 'Local no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      local
    });

  } catch (error) {
    console.error('Error al obtener local:', error);
    return NextResponse.json(
      { error: 'Error al obtener local' },
      { status: 500 }
    );
  }
}
