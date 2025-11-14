import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireRole } from '@/lib/middleware';

// GET - Obtener usuario por ID
export const GET = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        local: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { password, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      success: true,
      usuario: usuarioSinPassword
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
});

// PUT - Actualizar usuario
export const PUT = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { nombre, email, password, rol, localId, activo } = body;

    // Preparar datos a actualizar
    const dataToUpdate = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (email !== undefined) dataToUpdate.email = email;
    if (rol !== undefined) {
      const rolesValidos = ['superadmin', 'admin', 'staff'];
      if (!rolesValidos.includes(rol)) {
        return NextResponse.json(
          { error: 'Rol inválido' },
          { status: 400 }
        );
      }
      dataToUpdate.rol = rol;
    }
    if (localId !== undefined) dataToUpdate.localId = localId || null;
    if (activo !== undefined) dataToUpdate.activo = activo;

    // Si se proporciona nueva contraseña
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        local: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      }
    });

    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      success: true,
      usuario: usuarioSinPassword,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está en uso' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar usuario
export const DELETE = requireRole('superadmin')(async (request, { params }) => {
  try {
    const { id } = params;
    const userId = parseInt(id);

    // No permitir eliminar al usuario actual
    if (request.user.id === userId) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propio usuario' },
        { status: 400 }
      );
    }

    await prisma.usuario.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
});
