import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener categorías por local ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const categorias = await prisma.categoria.findMany({
      where: { localId: parseInt(id) },
      orderBy: [
        { orden: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      categorias
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}
