const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@test.com';
  const password = '123456';
  const nombre = 'Admin Test';

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Verificar si ya existe
  const existingUser = await prisma.usuario.findFirst({
    where: { email }
  });

  if (existingUser) {
    console.log('❌ El usuario ya existe');
    console.log('Email:', email);
    console.log('Actualizando contraseña...');
    
    await prisma.usuario.updateMany({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Contraseña actualizada');
  } else {
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: 'superadmin',
        activo: true
      }
    });

    console.log('✅ Usuario creado exitosamente:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Rol:', user.rol);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
