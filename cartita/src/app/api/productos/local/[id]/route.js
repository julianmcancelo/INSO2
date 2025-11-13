import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener productos por local ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get('categoriaId');

    const where = {
      localId: parseInt(id)
    };

    // Si se especifica categoría, filtrar por ella
    if (categoriaId) {
      where.categoriaId = parseInt(categoriaId);
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            icono: true
          }
        }
      },
      orderBy: [
        { destacado: 'desc' },
        { orden: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      productos
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
