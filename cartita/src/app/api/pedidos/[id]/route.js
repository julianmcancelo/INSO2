import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';

// GET - Obtener pedido por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.query(
      `SELECT p.*, 
              json_agg(
                json_build_object(
                  'id', pi.id,
                  'cantidad', pi.cantidad,
                  'precio_unitario', pi.precio_unitario,
                  'subtotal', pi.subtotal,
                  'producto', json_build_object(
                    'id', prod.id,
                    'nombre', prod.nombre
                  )
                )
              ) as items
       FROM pedidos p
       LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
       LEFT JOIN productos prod ON pi.producto_id = prod.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pedido: result.rows[0]
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener pedido' },
      { status: 500 }
    );
  }
}
