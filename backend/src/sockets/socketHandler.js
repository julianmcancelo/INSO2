/**
 * Manejador de eventos de Socket.IO
 * Gestiona conexiones en tiempo real para pedidos y actualizaciones
 */

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // Unirse a una sala específica del local
    socket.on('join-local', (localId) => {
      const room = `local-${localId}`;
      socket.join(room);
      console.log(`Cliente ${socket.id} se unió a la sala: ${room}`);
      
      socket.emit('joined', { 
        room, 
        message: 'Conectado a actualizaciones en tiempo real del local' 
      });
    });

    // Unirse a sala de seguimiento de pedido (para cliente)
    socket.on('join-pedido', (pedidoId) => {
      const room = `pedido-${pedidoId}`;
      socket.join(room);
      console.log(`Cliente ${socket.id} se unió a la sala: ${room}`);
      
      socket.emit('joined-pedido', { 
        pedidoId,
        message: 'Siguiendo estado del pedido' 
      });
    });

    // Salir de una sala
    socket.on('leave-local', (localId) => {
      const room = `local-${localId}`;
      socket.leave(room);
      console.log(`Cliente ${socket.id} salió de la sala: ${room}`);
    });

    socket.on('leave-pedido', (pedidoId) => {
      const room = `pedido-${pedidoId}`;
      socket.leave(room);
      console.log(`Cliente ${socket.id} salió de la sala: ${room}`);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });

    // Ping/pong para mantener conexión viva
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Funciones auxiliares para emitir eventos a salas específicas
  io.emitToLocal = (localId, event, data) => {
    io.to(`local-${localId}`).emit(event, data);
  };

  io.emitToPedido = (pedidoId, event, data) => {
    io.to(`pedido-${pedidoId}`).emit(event, data);
  };

  console.log('🔌 Socket.IO configurado correctamente');
};
