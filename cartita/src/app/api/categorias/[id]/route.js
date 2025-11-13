import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener categoría por ID
export const GET = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;

    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      categoria
    });

  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json(
      { error: 'Error al obtener categoría' },
      { status: 500 }
    );
  }
});

// PUT - Actualizar categoría
export const PUT = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { nombre, descripcion, icono, orden } = body;

    const dataToUpdate = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (icono !== undefined) dataToUpdate.icono = icono;
    if (orden !== undefined) dataToUpdate.orden = orden;

    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return NextResponse.json({
      success: true,
      categoria,
      message: 'Categoría actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar categoría
export const DELETE = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;

    // Verificar si tiene productos
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    if (categoria._count.productos > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar. La categoría tiene ${categoria._count.productos} producto(s) asociado(s)` },
        { status: 400 }
      );
    }

    await prisma.categoria.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
});
