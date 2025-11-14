import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/middleware';

// PUT - Confirmar pago de pedido
export const PUT = requireAuth(requireRole(['admin', 'empleado'], async (request, context) => {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { estadoPago } = body; // 'confirmado' | 'rechazado'

    if (!estadoPago || !['confirmado', 'rechazado'].includes(estadoPago)) {
      return NextResponse.json(
        { error: 'Estado de pago inválido' },
        { status: 400 }
      );
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { 
        estadoPago,
        // Si se confirma el pago y el pedido está pendiente, cambiar a "en_preparacion"
        ...(estadoPago === 'confirmado' && { estado: 'en_preparacion' })
      }
    });

    return NextResponse.json({
      success: true,
      pedido,
      message: estadoPago === 'confirmado' 
        ? 'Pago confirmado exitosamente' 
        : 'Pago rechazado'
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al confirmar pago' },
      { status: 500 }
    );
  }
}));
