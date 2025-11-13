import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener producto por ID
export const GET = requireAuth(async (request, context) => {
  try {
    const { id } = context.params;
    const userLocalId = context?.user?.localId;

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            icono: true
          }
        }
      }
    });

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el producto pertenece al local del usuario (solo para admins)
    if (context?.user?.rol === 'admin' && userLocalId && producto.localId !== userLocalId) {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a este producto' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      producto
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
});

// PUT - Actualizar producto
export const PUT = requireAuth(async (request, context) => {
  try {
    const { id } = context.params;
    const userLocalId = context?.user?.localId;
    const body = await request.json();

    const {
      categoriaId,
      nombre,
      descripcion,
      precio,
      imagenBase64,
      tiempoPreparacion,
      disponible,
      destacado,
      orden
    } = body;

    // Verificar que el producto existe y pertenece al local del usuario
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!productoExistente) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (solo para admins)
    if (context?.user?.rol === 'admin' && userLocalId && productoExistente.localId !== userLocalId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este producto' },
        { status: 403 }
      );
    }

    const dataToUpdate = {};
    if (categoriaId !== undefined) dataToUpdate.categoriaId = parseInt(categoriaId);
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (precio !== undefined) dataToUpdate.precio = parseFloat(precio);
    if (imagenBase64 !== undefined) dataToUpdate.imagenBase64 = imagenBase64;
    if (tiempoPreparacion !== undefined) dataToUpdate.tiempoPreparacion = tiempoPreparacion;
    if (disponible !== undefined) dataToUpdate.disponible = disponible;
    if (destacado !== undefined) dataToUpdate.destacado = destacado;
    if (orden !== undefined) dataToUpdate.orden = orden;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            icono: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      producto
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar producto
export const DELETE = requireAuth(async (request, context) => {
  try {
    const { id } = context.params;
    const userLocalId = context?.user?.localId;

    // Verificar que el producto existe y pertenece al local del usuario
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!productoExistente) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (solo para admins)
    if (context?.user?.rol === 'admin' && userLocalId && productoExistente.localId !== userLocalId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este producto' },
        { status: 403 }
      );
    }

    await prisma.producto.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
});
