import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { superadmin, local } = body;

    // Validaciones
    if (!superadmin || !superadmin.nombre || !superadmin.email || !superadmin.password) {
      return NextResponse.json(
        { error: 'Datos del superadmin incompletos' },
        { status: 400 }
      );
    }

    // Verificar que no haya usuarios existentes
    const userCount = await prisma.usuario.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'La configuración inicial ya fue realizada' },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(superadmin.password, 10);

    // Crear el superadmin y el local en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el local si lo pasaron
      let localCreado = null;
      if (local && local.nombre && local.slug) {
        localCreado = await tx.local.create({
          data: {
            nombre: local.nombre,
            slug: local.slug,
            descripcion: `Local creado durante la configuración inicial`,
            colorPrimario: '#FF6B35',
            colorSecundario: '#004E89',
            activo: true,
            horarioAtencion: {
              lunes: '09:00-22:00',
              martes: '09:00-22:00',
              miercoles: '09:00-22:00',
              jueves: '09:00-22:00',
              viernes: '09:00-23:00',
              sabado: '10:00-23:00',
              domingo: '10:00-22:00'
            }
          }
        });

        // Crear las categorías por defecto para el local
        await tx.categoria.createMany({
          data: [
            {
              localId: localCreado.id,
              nombre: 'Entradas',
              icono: '🥗',
              orden: 1
            },
            {
              localId: localCreado.id,
              nombre: 'Platos Principales',
              icono: '🍽️',
              orden: 2
            },
            {
              localId: localCreado.id,
              nombre: 'Bebidas',
              icono: '🥤',
              orden: 3
            },
            {
              localId: localCreado.id,
              nombre: 'Postres',
              icono: '🍰',
              orden: 4
            }
          ]
        });
      }

      // Crear el superadmin
      const usuario = await tx.usuario.create({
        data: {
          nombre: superadmin.nombre,
          email: superadmin.email,
          password: hashedPassword,
          rol: 'superadmin',
          localId: localCreado?.id || null,
          activo: true
        }
      });

      // Crear la configuración global
      await tx.configuracionGlobal.create({
        data: {
          mantenimientoActivo: false
        }
      });

      return { usuario, local: localCreado };
    });

    return NextResponse.json({
      success: true,
      message: 'Configuración inicial completada',
      usuario: {
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        email: result.usuario.email,
        rol: result.usuario.rol
      },
      local: result.local ? {
        id: result.local.id,
        nombre: result.local.nombre,
        slug: result.local.slug
      } : null
    }, { status: 201 });

  } catch (error) {
    console.error('Error en setup inicial:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email o slug ya está en uso' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al realizar la configuración inicial' },
      { status: 500 }
    );
  }
}
