/**
 * Script para crear usuario de prueba en PRODUCCIÓN
 * Ejecutar: node scripts/crear-usuario-produccion.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creando usuario de prueba en PRODUCCIÓN...\n');

  try {
    // Verificar si ya existe el usuario
    const existingUsers = await prisma.usuario.findMany({
      where: { email: 'admin@test.com' }
    });

    if (existingUsers.length > 0) {
      console.log('⚠️  El usuario admin@test.com ya existe');
      console.log('📊 Usuarios encontrados:', existingUsers.length);
      
      for (const user of existingUsers) {
        console.log(`\n👤 Usuario ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.nombre}`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   Local ID: ${user.localId}`);
        console.log(`   Activo: ${user.activo}`);
      }
      
      return;
    }

    // Crear local de prueba
    console.log('🏪 Creando local de prueba...');
    const local = await prisma.local.create({
      data: {
        nombre: 'Local de Prueba',
        slug: 'local-prueba',
        descripcion: 'Local de prueba para testing',
        direccion: 'Calle Falsa 123',
        telefono: '+54 11 1234-5678',
        email: 'local@test.com',
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
    console.log('✅ Local creado:', local.nombre, '(ID:', local.id, ')');

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Crear usuario admin
    console.log('\n👤 Creando usuario admin...');
    const usuario = await prisma.usuario.create({
      data: {
        nombre: 'Admin Test',
        email: 'admin@test.com',
        password: hashedPassword,
        rol: 'admin',
        localId: local.id,
        activo: true
      }
    });

    console.log('✅ Usuario creado exitosamente!\n');
    console.log('📋 Credenciales de acceso:');
    console.log('   Email: admin@test.com');
    console.log('   Password: 123456');
    console.log('   Rol:', usuario.rol);
    console.log('   Local:', local.nombre);
    console.log('\n🎉 ¡Listo! Ahora puedes hacer login en https://cartita.digital/admin/login');

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
