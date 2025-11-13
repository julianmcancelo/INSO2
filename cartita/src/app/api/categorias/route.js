import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener categorías
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const localId = searchParams.get('localId');

    if (!localId) {
      return NextResponse.json(
        { error: 'localId es requerido' },
        { status: 400 }
      );
    }

    const categorias = await prisma.categoria.findMany({
      where: { localId: parseInt(localId) },
      orderBy: [
        { orden: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      categorias
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

// POST - Crear categoría
export const POST = requireAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { nombre, descripcion, icono, orden, localId } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    // Usar localId del body o del context.user
    const categoriaLocalId = localId || context?.user?.localId;

    if (!categoriaLocalId) {
      return NextResponse.json(
        { error: 'localId es requerido' },
        { status: 400 }
      );
    }

    const categoria = await prisma.categoria.create({
      data: {
        localId: parseInt(categoriaLocalId),
        nombre,
        descripcion: descripcion || null,
        icono: icono || null,
        orden: orden || 0
      }
    });

    return NextResponse.json({
      success: true,
      categoria
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
});
