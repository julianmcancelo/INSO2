import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener producto por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      producto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export const PUT = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const db = await getDb();

    const {
      categoriaId,
      nombre,
      descripcion,
      precio,
      imagenBase64,
      tiempoPreparacion,
      disponible,
      destacado
    } = body;

    const result = await db.query(
      `UPDATE productos 
       SET categoria_id = $1, nombre = $2, descripcion = $3, precio = $4,
           imagen_base64 = $5, tiempo_preparacion = $6, disponible = $7,
           destacado = $8, updated_at = NOW()
       WHERE id = $9 AND local_id = $10
       RETURNING *`,
      [
        categoriaId,
        nombre,
        descripcion,
        precio,
        imagenBase64,
        tiempoPreparacion,
        disponible,
        destacado,
        id,
        request.user.localId
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado o sin permisos' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      producto: result.rows[0]
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
export const DELETE = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.query(
      'DELETE FROM productos WHERE id = $1 AND local_id = $2 RETURNING id',
      [id, request.user.localId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado o sin permisos' },
        { status: 404 }
      );
    }

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
