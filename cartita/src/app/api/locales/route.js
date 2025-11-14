import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/middleware';

// GET - Obtener todos los locales (según rol del usuario)
export const GET = requireAuth(async (request, { user }) => {
  try {
    let locales;

    if (user.rol === 'superadmin') {
      // Superadmin ve todos los locales
      locales = await prisma.local.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          usuarios: {
            select: {
              id: true,
              nombre: true,
              email: true,
              rol: true
            }
          }
        }
      });
    } else {
      // Admin: buscar todos los usuarios con el mismo email
      // (puede haber múltiples usuarios con el mismo email pero diferentes locales)
      const usuariosConMismoEmail = await prisma.usuario.findMany({
        where: {
          email: user.email,
          rol: 'admin'
        },
        select: {
          localId: true
        }
      });

      // Extraer los IDs de locales únicos
      const localIds = [...new Set(
        usuariosConMismoEmail
          .map(u => u.localId)
          .filter(id => id !== null)
      )];
      if (localIds.length > 0) {
        // Obtener los locales
        locales = await prisma.local.findMany({
          where: {
            id: {
              in: localIds
            }
          },
          include: {
            usuarios: {
              select: {
                id: true,
                nombre: true,
                email: true,
                rol: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      } else {
        locales = [];
      }
    }
    return NextResponse.json({
      success: true,
      locales
    });

  } catch (error) {    return NextResponse.json(
      { error: 'Error al obtener locales' },
      { status: 500 }
    );
  }
});

// POST - Crear local (solo superadmin)
export const POST = requireRole('superadmin')(async (request) => {
  try {
    const body = await request.json();
    const {
      nombre,
      slug,
      descripcion,
      direccion,
      telefono,
      email,
      logoBase64,
      colorPrimario,
      colorSecundario
    } = body;

    if (!nombre || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      );
    }

    const local = await prisma.local.create({
      data: {
        nombre,
        slug,
        descripcion: descripcion || null,
        direccion: direccion || null,
        telefono: telefono || null,
        email: email || null,
        logoBase64: logoBase64 || null,
        colorPrimario: colorPrimario || '#FF6B35',
        colorSecundario: colorSecundario || '#004E89',
        activo: true
      }
    });

    return NextResponse.json({
      success: true,
      local
    }, { status: 201 });

  } catch (error) {    
    if (error.code === 'P2002') { // Unique violation
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear local' },
      { status: 500 }
    );
  }
});
