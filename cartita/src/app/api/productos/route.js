import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { sanitizeString, isPositiveInteger, isPositiveNumber, isValidBase64Image } from '@/lib/security';

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

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear producto
export const POST = requireAuth(async (request, context) => {
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
      orden,
      localId
    } = body;

    // Validaciones básicas
    if (!categoriaId || !nombre || !precio) {
      return NextResponse.json(
        { error: 'Campos requeridos: categoriaId, nombre, precio' },
        { status: 400 }
      );
    }

    // Validar tipos de datos
    if (!isPositiveInteger(categoriaId)) {
      return NextResponse.json(
        { error: 'categoriaId debe ser un número entero positivo' },
        { status: 400 }
      );
    }

    if (!isPositiveNumber(precio)) {
      return NextResponse.json(
        { error: 'precio debe ser un número positivo' },
        { status: 400 }
      );
    }

    // Validar longitud de strings
    if (nombre.length < 1 || nombre.length > 200) {
      return NextResponse.json(
        { error: 'nombre debe tener entre 1 y 200 caracteres' },
        { status: 400 }
      );
    }

    if (descripcion && descripcion.length > 1000) {
      return NextResponse.json(
        { error: 'descripción no puede exceder 1000 caracteres' },
        { status: 400 }
      );
    }

    // Validar imagen base64 si se proporciona
    if (imagenBase64 && !isValidBase64Image(imagenBase64)) {
      return NextResponse.json(
        { error: 'Imagen inválida o demasiado grande (máximo 5MB)' },
        { status: 400 }
      );
    }

    // Usar localId del body o del context.user
    const productLocalId = localId || context?.user?.localId;

    if (!productLocalId) {
      return NextResponse.json(
        { error: 'localId es requerido' },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        categoriaId: parseInt(categoriaId),
        localId: parseInt(productLocalId),
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

  } catch (error) {    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
});
