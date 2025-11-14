import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar si hay usuarios en la base de datos
    const userCount = await prisma.usuario.count();

    return NextResponse.json({
      success: true,
      setupNeeded: userCount === 0
    });

  } catch (error) {    
    // Si hay error de conexión o tablas no existen, setup es necesario
    return NextResponse.json({
      success: true,
      setupNeeded: true
    });
  }
}
