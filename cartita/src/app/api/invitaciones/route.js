import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/middleware';

// GET - Obtener todas las invitaciones (solo superadmin)
export const GET = requireRole('superadmin')(async (request) => {
  try {
    const invitaciones = await prisma.invitacion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      invitaciones
    });

  } catch (error) {
    console.error('Error al obtener invitaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener invitaciones' },
      { status: 500 }
    );
  }
});
