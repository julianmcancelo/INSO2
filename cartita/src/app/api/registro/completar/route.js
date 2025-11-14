import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, local, usuario } = body;

    // Validaciones
    if (!token || !local || !usuario) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar invitación
    const invitacion = await prisma.invitacion.findUnique({
      where: { token }
    });

    if (!invitacion) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    if (invitacion.usado) {
      return NextResponse.json(
        { error: 'Esta invitación ya fue utilizada' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(invitacion.expiraEn)) {
      return NextResponse.json(
        { error: 'Esta invitación ha expirado' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const localExistente = await prisma.local.findUnique({
      where: { slug: local.slug }
    });

    if (localExistente) {
      return NextResponse.json(
        { error: 'El slug ya está en uso. Por favor elige otro.' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(usuario.password, 10);

    // Crear local y usuario en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear local
      const nuevoLocal = await tx.local.create({
        data: {
          nombre: local.nombre,
          slug: local.slug,
          descripcion: local.descripcion || null,
          direccion: local.direccion || null,
          telefono: local.telefono || null,
          email: local.email || null,
          colorPrimario: '#FF6B35',
          colorSecundario: '#004E89',
          activo: true,
          // Guardamos el horario como JSON string para que encaje con el tipo String del schema
          horarioAtencion: JSON.stringify({
            lunes: '09:00-22:00',
            martes: '09:00-22:00',
            miercoles: '09:00-22:00',
            jueves: '09:00-22:00',
            viernes: '09:00-23:00',
            sabado: '10:00-23:00',
            domingo: '10:00-22:00'
          })
        }
      });

      // Crear usuario admin
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombre: usuario.nombre,
          email: usuario.email,
          password: hashedPassword,
          rol: invitacion.rol || 'admin',
          localId: nuevoLocal.id,
          activo: true
        }
      });

      // Marcar invitación como usada
      await tx.invitacion.update({
        where: { token },
        data: {
          usado: true,
          localId: nuevoLocal.id
        }
      });

      // Crear categorías por defecto
      await tx.categoria.createMany({
        data: [
          {
            localId: nuevoLocal.id,
            nombre: 'Entradas',
            icono: '🥗',
            orden: 1
          },
          {
            localId: nuevoLocal.id,
            nombre: 'Platos Principales',
            icono: '🍽️',
            orden: 2
          },
          {
            localId: nuevoLocal.id,
            nombre: 'Bebidas',
            icono: '🥤',
            orden: 3
          },
          {
            localId: nuevoLocal.id,
            nombre: 'Postres',
            icono: '🍰',
            orden: 4
          }
        ]
      });

      return { local: nuevoLocal, usuario: nuevoUsuario };
    });

    // TODO: Enviar email de bienvenida

    return NextResponse.json({
      success: true,
      message: 'Registro completado exitosamente',
      local: {
        id: result.local.id,
        nombre: result.local.nombre,
        slug: result.local.slug
      },
      usuario: {
        id: result.usuario.id,
        nombre: result.usuario.nombre,
        email: result.usuario.email,
        rol: result.usuario.rol
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al completar registro:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email o slug ya está en uso' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al completar el registro' },
      { status: 500 }
    );
  }
}
