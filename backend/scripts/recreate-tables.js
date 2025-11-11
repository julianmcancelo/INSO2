const { sequelize } = require('../src/config/database');
const Usuario = require('../src/models/Usuario');
const Local = require('../src/models/Local');
const Categoria = require('../src/models/Categoria');
const Producto = require('../src/models/Producto');
const Pedido = require('../src/models/Pedido');
const PedidoItem = require('../src/models/PedidoItem');
const Solicitud = require('../src/models/Solicitud');
const ConfiguracionGlobal = require('../src/models/ConfiguracionGlobal');
const ConfiguracionPago = require('../src/models/ConfiguracionPago');
const Invitacion = require('../src/models/Invitacion');

async function recreateTables() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    console.log('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos existentes');
    console.log('🗑️  Eliminando tablas existentes...');
    
    // Forzar la recreación de todas las tablas
    await sequelize.sync({ force: true });
    
    console.log('✅ Tablas recreadas exitosamente');
    console.log('📋 Tablas creadas:');
    console.log('   - usuarios (con campos resetPasswordToken y resetPasswordExpires)');
    console.log('   - locales');
    console.log('   - categorias');
    console.log('   - productos');
    console.log('   - pedidos');
    console.log('   - pedido_items');
    console.log('   - solicitudes');
    console.log('   - configuracion_global');
    console.log('   - configuracion_pago');
    console.log('   - invitaciones');
    
    console.log('\n✨ Proceso completado. Ahora puedes ejecutar el setup inicial.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al recrear tablas:', error);
    process.exit(1);
  }
}

recreateTables();
