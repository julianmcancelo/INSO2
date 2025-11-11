const { sequelize } = require('../src/config/database');
const Usuario = require('../src/models/Usuario');
const Local = require('../src/models/Local');
const Categoria = require('../src/models/Categoria');
const Producto = require('../src/models/Producto');
const Pedido = require('../src/models/Pedido');
const ItemPedido = require('../src/models/ItemPedido');
const Solicitud = require('../src/models/Solicitud');
const Configuracion = require('../src/models/Configuracion');
const ConfiguracionPago = require('../src/models/ConfiguracionPago');

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
    console.log('   - items_pedido');
    console.log('   - solicitudes');
    console.log('   - configuracion');
    console.log('   - configuracion_pago');
    
    console.log('\n✨ Proceso completado. Ahora puedes ejecutar el setup inicial.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al recrear tablas:', error);
    process.exit(1);
  }
}

recreateTables();
