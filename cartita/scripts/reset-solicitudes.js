const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Reseteando solicitudes...');

  // Actualizar todas las solicitudes a pendiente
  const result = await prisma.solicitud.updateMany({
    where: {
      estado: {
        in: ['aceptada', 'rechazada']
      }
    },
    data: {
      estado: 'pendiente'
    }
  });

  console.log(`✅ ${result.count} solicitudes actualizadas a pendiente`);

  // Eliminar todas las invitaciones
  const invitaciones = await prisma.invitacion.deleteMany({});
  console.log(`🗑️ ${invitaciones.count} invitaciones eliminadas`);

  console.log('✅ Reset completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
