/**
 * Script para resetear la contraseña de un usuario
 * Ejecutar: node scripts/resetear-password.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// CONFIGURACIÓN: Cambia estos valores
const EMAIL = 'juliancancelo@gmail.com'; // Email del usuario
const NUEVA_PASSWORD = '123456'; // Nueva contraseña

async function main() {
  console.log('🔐 Reseteando contraseña...\n');
  console.log(`📧 Email: ${EMAIL}`);
  console.log(`🔑 Nueva contraseña: ${NUEVA_PASSWORD}\n`);

  try {
    // Buscar usuarios con ese email
    const usuarios = await prisma.usuario.findMany({
      where: { email: EMAIL }
    });

    if (usuarios.length === 0) {
      console.log('❌ No se encontró ningún usuario con ese email');
      return;
    }

    console.log(`✅ Encontrados ${usuarios.length} usuario(s) con ese email\n`);

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(NUEVA_PASSWORD, 10);

    // Actualizar contraseña para todos los usuarios con ese email
    const result = await prisma.usuario.updateMany({
      where: { email: EMAIL },
      data: { password: hashedPassword }
    });

    console.log(`✅ Contraseña actualizada para ${result.count} usuario(s)\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Credenciales actualizadas:');
    console.log(`   Email: ${EMAIL}`);
    console.log(`   Password: ${NUEVA_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 ¡Listo! Ahora puedes hacer login con estas credenciales');

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
