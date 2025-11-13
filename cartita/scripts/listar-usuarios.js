/**
 * Script para listar todos los usuarios
 * Ejecutar: node scripts/listar-usuarios.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Listando todos los usuarios...\n');

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
        id: 'asc'
      }
    });

    if (usuarios.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Total de usuarios: ${usuarios.length}\n`);

    for (const user of usuarios) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Rol: ${user.rol}`);
      console.log(`   Local ID: ${user.localId || 'Sin local'}`);
      if (user.local) {
        console.log(`   Local: ${user.local.nombre} (${user.local.slug})`);
      }
      console.log(`   Activo: ${user.activo ? '✅ Sí' : '❌ No'}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString('es-AR')}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
