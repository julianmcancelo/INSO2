import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';
import { requireAuth } from '@/lib/middleware';

// PUT - Actualizar estado del pedido
export const PUT = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const { estado } = await request.json();

    const estadosValidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.query(
      `UPDATE pedidos 
       SET estado = $1, updated_at = NOW()
       WHERE id = $2 AND local_id = $3
       RETURNING *`,
      [estado, id, request.user.localId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Pedido no encontrado o sin permisos' },
        { status: 404 }
      );
    }

    // TODO: Emitir evento Socket.IO
    // socket.to(`pedido-${id}`).emit('estado-actualizado', { pedidoId: id, estado });

    return NextResponse.json({
      success: true,
      pedido: result.rows[0]
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
});
