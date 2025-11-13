import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

// GET - Obtener local por ID
export const GET = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;

    const local = await prisma.local.findUnique({
      where: { id: parseInt(id) }
    });

    if (!local) {
      return NextResponse.json(
        { error: 'Local no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      local
    });

  } catch (error) {
    console.error('Error al obtener local:', error);
    return NextResponse.json(
      { error: 'Error al obtener local' },
      { status: 500 }
    );
  }
});

// PUT - Actualizar local
export const PUT = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      nombre,
      descripcion,
      direccion,
      telefono,
      email,
      logoBase64,
      colorPrimario,
      colorSecundario,
      horarioAtencion
    } = body;

    const dataToUpdate = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (direccion !== undefined) dataToUpdate.direccion = direccion;
    if (telefono !== undefined) dataToUpdate.telefono = telefono;
    if (email !== undefined) dataToUpdate.email = email;
    if (logoBase64 !== undefined) dataToUpdate.logoBase64 = logoBase64;
    if (colorPrimario !== undefined) dataToUpdate.colorPrimario = colorPrimario;
    if (colorSecundario !== undefined) dataToUpdate.colorSecundario = colorSecundario;
    if (horarioAtencion !== undefined) dataToUpdate.horarioAtencion = horarioAtencion;

    const local = await prisma.local.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return NextResponse.json({
      success: true,
      local
    });

  } catch (error) {
    console.error('Error al actualizar local:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Local no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar local' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar local
export const DELETE = requireAuth(async (request, { params }) => {
  try {
    const { id } = params;

    await prisma.local.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Local eliminado'
    });

  } catch (error) {
    console.error('Error al eliminar local:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Local no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar local' },
      { status: 500 }
    );
  }
});
