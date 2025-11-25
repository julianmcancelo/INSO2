const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario superadmin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superadmin = await prisma.usuario.upsert({
    where: { email_local_unique: { email: 'cartita.digitalok@gmail.com', localId: null } },
    update: {},
    create: {
      nombre: 'Super Admin',
      email: 'cartita.digitalok@gmail.com',
      password: hashedPassword,
      rol: 'superadmin',
      localId: null,
      activo: true
    }
  });

  console.log('✅ Superadmin creado:', superadmin.email);

  // Crear local de ejemplo
  const local = await prisma.local.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      nombre: 'Restaurante Demo',
      slug: 'demo',
      descripcion: 'Restaurante de demostración',
      direccion: 'Av. Ejemplo 123, Buenos Aires',
      telefono: '+54 11 1234-5678',
      email: 'demo@cartita.digital',
      colorPrimario: '#FF6B35',
      colorSecundario: '#004E89',
      horarioAtencion: {
        lunes: '09:00-22:00',
        martes: '09:00-22:00',
        miercoles: '09:00-22:00',
        jueves: '09:00-22:00',
        viernes: '09:00-23:00',
        sabado: '10:00-23:00',
        domingo: '10:00-22:00'
      },
      activo: true
    }
  });

  console.log('✅ Local demo creado:', local.nombre);

  // Crear categorías de ejemplo
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        localId: local.id,
        nombre: 'Entradas',
        descripcion: 'Para empezar',
        icono: '🥗',
        orden: 1
      }
    }),
    prisma.categoria.create({
      data: {
        localId: local.id,
        nombre: 'Platos Principales',
        descripcion: 'Nuestros mejores platos',
        icono: '🍽️',
        orden: 2
      }
    }),
    prisma.categoria.create({
      data: {
        localId: local.id,
        nombre: 'Bebidas',
        descripcion: 'Refrescate',
        icono: '🥤',
        orden: 3
      }
    }),
    prisma.categoria.create({
      data: {
        localId: local.id,
        nombre: 'Postres',
        descripcion: 'Dulce final',
        icono: '🍰',
        orden: 4
      }
    })
  ]);

  console.log('✅ Categorías creadas:', categorias.length);

  // Crear productos de ejemplo
  const productos = await Promise.all([
    prisma.producto.create({
      data: {
        categoriaId: categorias[0].id,
        localId: local.id,
        nombre: 'Ensalada César',
        descripcion: 'Lechuga, pollo grillado, crutones y aderezo césar',
        precio: 1500,
        disponible: true,
        destacado: true,
        tiempoPreparacion: 15
      }
    }),
    prisma.producto.create({
      data: {
        categoriaId: categorias[1].id,
        localId: local.id,
        nombre: 'Hamburguesa Completa',
        descripcion: 'Carne, queso, lechuga, tomate, cebolla y papas fritas',
        precio: 2500,
        disponible: true,
        destacado: true,
        tiempoPreparacion: 20
      }
    }),
    prisma.producto.create({
      data: {
        categoriaId: categorias[2].id,
        localId: local.id,
        nombre: 'Coca Cola 500ml',
        descripcion: 'Bebida gaseosa',
        precio: 500,
        disponible: true,
        tiempoPreparacion: 2
      }
    }),
    prisma.producto.create({
      data: {
        categoriaId: categorias[3].id,
        localId: local.id,
        nombre: 'Flan Casero',
        descripcion: 'Con dulce de leche y crema',
        precio: 800,
        disponible: true,
        tiempoPreparacion: 5
      }
    })
  ]);

  console.log('✅ Productos creados:', productos.length);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('   Email: cartita.digitalok@gmail.com');
  console.log('   Password: admin123');
  console.log('\n🌐 Local demo disponible en: /menu/demo');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
