import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { requireAuth } from '@/lib/middleware';

// GET - Traer pedidos
export const GET = requireAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const localId = searchParams.get('localId') || request.user.localId;
    const limit = parseInt(searchParams.get('limit') || '50');
    const estado = searchParams.get('estado');

    const db = await getDb();
    
    let query = `
      SELECT p.*, 
             json_agg(
               json_build_object(
                 'id', pi.id,
                 'cantidad', pi.cantidad,
                 'precio_unitario', pi.precio_unitario,
                 'subtotal', pi.subtotal,
                 'producto', json_build_object(
                   'id', prod.id,
                   'nombre', prod.nombre,
                   'imagen_base64', prod.imagen_base64
                 )
               )
             ) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      LEFT JOIN productos prod ON pi.producto_id = prod.id
      WHERE p.local_id = $1
    `;
    
    const params = [localId];

    if (estado) {
      query += ' AND p.estado = $2';
      params.push(estado);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await db.query(query, params);

    return NextResponse.json({
      success: true,
      pedidos: result.rows
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
});

// POST - Crear pedido
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      localId,
      nombreCliente,
      telefonoCliente,
      tipoEntrega,
      direccion,
      items,
      total,
      notas
    } = body;

    // Validaciones
    if (!localId || !nombreCliente || !telefonoCliente || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Generar el número de pedido
    const numeroPedidoResult = await db.query(
      'SELECT COALESCE(MAX(numero_pedido), 0) + 1 as siguiente FROM pedidos WHERE local_id = $1',
      [localId]
    );
    const numeroPedido = numeroPedidoResult.rows[0].siguiente;

    // Crear el pedido
    const pedidoResult = await db.query(
      `INSERT INTO pedidos 
       (local_id, numero_pedido, nombre_cliente, telefono_cliente, 
        tipo_entrega, direccion, total, notas, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pendiente') 
       RETURNING *`,
      [localId, numeroPedido, nombreCliente, telefonoCliente, 
       tipoEntrega, direccion, total, notas]
    );

    const pedido = pedidoResult.rows[0];

    // Crear los items del pedido
    for (const item of items) {
      await db.query(
        `INSERT INTO pedido_items 
         (pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizaciones, notas) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          pedido.id,
          item.productoId,
          item.cantidad,
          item.precioUnitario,
          item.subtotal,
          JSON.stringify(item.personalizaciones || {}),
          item.notas
        ]
      );
    }

    // TODO: Emitir evento Socket.IO
    // socket.to(`local-${localId}`).emit('nuevo-pedido', pedido);

    return NextResponse.json({
      success: true,
      pedido
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}
