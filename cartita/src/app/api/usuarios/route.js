import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireRole } from '@/lib/middleware';

// GET - Obtener todos los usuarios (solo superadmin)
export const GET = requireRole('superadmin')(async (request) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        local: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Remover passwords
    const usuariosSinPassword = usuarios.map(({ password, ...usuario }) => usuario);

    return NextResponse.json({
      success: true,
      usuarios: usuariosSinPassword
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
});

// POST - Crear nuevo usuario (solo superadmin)
export const POST = requireRole('superadmin')(async (request) => {
  try {
    const body = await request.json();
    const { nombre, email, password, rol, localId } = body;

    // Validaciones
    if (!nombre || !email || !password || !rol) {
      return NextResponse.json(
        { error: 'Nombre, email, password y rol son requeridos' },
        { status: 400 }
      );
    }

    // Validar rol
    const rolesValidos = ['superadmin', 'admin', 'staff'];
    if (!rolesValidos.includes(rol)) {
      return NextResponse.json(
        { error: 'Rol inválido' },
        { status: 400 }
      );
    }

    // Validar que admin/staff tengan localId
    if ((rol === 'admin' || rol === 'staff') && !localId) {
      return NextResponse.json(
        { error: 'Admin y staff requieren un local asignado' },
        { status: 400 }
      );
    }

    // Verificar que el email no exista
    const existente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existente) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol,
        localId: localId || null,
        activo: true
      },
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

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      success: true,
      usuario: usuarioSinPassword,
      message: 'Usuario creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
});
