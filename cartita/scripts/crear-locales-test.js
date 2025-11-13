const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Crear dos locales de prueba
  const locales = [
    {
      nombre: 'Restaurante El Buen Sabor',
      slug: 'el-buen-sabor',
      descripcion: 'Comida casera y tradicional',
      direccion: 'Av. Corrientes 1234, CABA',
      telefono: '+54 11 1234-5678',
      email: 'contacto@elbuensabor.com',
      colorPrimario: '#FF6B35',
      colorSecundario: '#004E89',
      activo: true
    },
    {
      nombre: 'Pizzería La Napolitana',
      slug: 'la-napolitana',
      descripcion: 'Las mejores pizzas artesanales',
      direccion: 'Av. Santa Fe 5678, CABA',
      telefono: '+54 11 8765-4321',
      email: 'info@lanapolitana.com',
      colorPrimario: '#E63946',
      colorSecundario: '#1D3557',
      activo: true
    }
  ];

  console.log('🏪 Creando locales de prueba...\n');

  for (const localData of locales) {
    // Verificar si ya existe
    const existing = await prisma.local.findUnique({
      where: { slug: localData.slug }
    });

    if (existing) {
      console.log(`⚠️  Local "${localData.nombre}" ya existe (slug: ${localData.slug})`);
    } else {
      const local = await prisma.local.create({
        data: localData
      });
      console.log(`✅ Local creado: "${local.nombre}" (ID: ${local.id})`);
    }
  }

  console.log('\n🎉 Proceso completado!');
  console.log('\nAhora puedes:');
  console.log('1. Asignar estos locales a usuarios desde el panel de superadmin');
  console.log('2. O crear usuarios admin con estos locales asignados');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
