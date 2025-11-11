const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { sequelize } = require('./config/database');
const socketHandler = require('./sockets/socketHandler');

// Importar rutas
const setupRoutes = require('./routes/setup.routes');
const authRoutes = require('./routes/auth.routes');
const localRoutes = require('./routes/local.routes');
const invitationRoutes = require('./routes/invitation.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const configuracionRoutes = require('./routes/configuracion.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const configuracionPagoRoutes = require('./routes/configuracionPago');
const passwordRoutes = require('./routes/password');

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Aumentado para imágenes Base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Hacer io accesible en las rutas
app.set('io', io);

// Rutas de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    service: 'Menu Digital API'
  });
});

// Rutas de API
app.use('/api/setup', setupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locales', localRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/configuracion-pago', configuracionPagoRoutes);
app.use('/api/password', passwordRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Configurar Socket.IO
socketHandler(io);

const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');

    // Sincronizar modelos (en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 Socket.IO escuchando conexiones`);
      console.log(`📱 API de Menú Digital lista`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGINT', async () => {
  console.log('\n⏳ Cerrando servidor...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Solo iniciar servidor si no estamos en Vercel
if (process.env.VERCEL !== '1') {
  startServer();
}

// Exportar app para Vercel Serverless
module.exports = app;
