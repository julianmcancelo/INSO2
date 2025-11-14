import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Endpoint público para mostrar locales en la landing (slider de marcas)
export async function GET() {
  try {
    const locales = await prisma.local.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        logoBase64: true,
        colorPrimario: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      locales,
    });
  } catch (error) {
    console.error('Error al obtener locales públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener locales públicos' },
      { status: 500 }
    );
  }
}
