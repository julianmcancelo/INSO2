import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener productos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const localId = searchParams.get('localId');
    const disponible = searchParams.get('disponible');

    if (!localId) {
      return NextResponse.json(
        { error: 'localId es requerido' },
        { status: 400 }
      );
    }

    const where = {
      localId: parseInt(localId)
    };

    if (disponible !== null && disponible !== undefined) {
      where.disponible = disponible === 'true';
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
        { orden: 'asc' },
        { createdAt: 'desc' }
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

// POST - Crear producto
export const POST = requireAuth(async (request) => {
  try {
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
      opciones,
      orden
    } = body;

    // Validaciones
    if (!categoriaId || !nombre || !precio) {
      return NextResponse.json(
        { error: 'Campos requeridos: categoriaId, nombre, precio' },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        categoriaId: parseInt(categoriaId),
        localId: request.user.localId,
        nombre,
        descripcion: descripcion || null,
        precio: parseFloat(precio),
        imagenBase64: imagenBase64 || null,
        tiempoPreparacion: tiempoPreparacion || null,
        disponible: disponible !== undefined ? disponible : true,
        destacado: destacado || false,
        opciones: opciones || null,
        orden: orden || 0
      },
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
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
});
