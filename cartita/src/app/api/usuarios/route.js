import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireRole } from '@/lib/middleware';

// GET - Traer todos los usuarios (solo superadmin)
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

    // Sacar las contraseñas
    const usuariosSinPassword = usuarios.map(({ password, ...usuario }) => usuario);

    return NextResponse.json({
      success: true,
      usuarios: usuariosSinPassword
    });

  } catch (error) {
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

    // Validar el rol
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

    // Verificar que el email no exista ya
    const existente = await prisma.usuario.findFirst({
      where: { email }
    });

    if (existente) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
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

    // Sacar la contraseña de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      success: true,
      usuario: usuarioSinPassword,
      message: 'Usuario creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    
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
