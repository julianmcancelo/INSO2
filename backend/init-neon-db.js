// Script para inicializar la base de datos Neon
// Configurar DATABASE_URL manualmente
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
process.env.NODE_ENV = 'development';

const { sequelize } = require('./src/config/database');

// Importar todos los modelos
require('./src/models/Usuario');
require('./src/models/Local');
require('./src/models/Categoria');
require('./src/models/Producto');
require('./src/models/Pedido');
require('./src/models/PedidoItem');
require('./src/models/ConfiguracionGlobal');
require('./src/models/Solicitud');
require('./src/models/Invitacion');
require('./src/models/ConfiguracionPago');

const bcrypt = require('bcryptjs');
const Usuario = require('./src/models/Usuario');

async function initDatabase() {
  try {
    console.log('🔌 Conectando a Neon PostgreSQL...');
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a Neon');

    console.log('\n📋 Creando tablas...');
    
    // Crear todas las tablas (force: false no borra datos existentes)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tablas creadas/actualizadas correctamente');

    // Verificar si ya existe un superadmin
    const adminExists = await Usuario.findOne({ where: { rol: 'superadmin' } });
    
    if (!adminExists) {
      console.log('\n👤 Creando usuario superadmin...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await Usuario.create({
        nombre: 'Admin Principal',
        email: 'admin@cartita.com',
        password: hashedPassword,
        rol: 'superadmin',
        activo: true
      });
      
      console.log('✅ Usuario superadmin creado:');
      console.log('   Email: admin@cartita.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  CAMBIA LA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN');
    } else {
      console.log('\n✅ Ya existe un usuario superadmin');
    }

    console.log('\n🎉 Base de datos inicializada correctamente');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Ve a tu app en Vercel');
    console.log('2. Login con admin@cartita.com / admin123');
    console.log('3. Cambia la contraseña');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
