import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado a Socket.IO');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado de Socket.IO');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinLocal(localId) {
    if (this.socket) {
      this.socket.emit('join-local', localId);
    }
  }

  leaveLocal(localId) {
    if (this.socket) {
      this.socket.emit('leave-local', localId);
    }
  }

  joinPedido(pedidoId) {
    if (this.socket) {
      this.socket.emit('join-pedido', pedidoId);
    }
  }

  leavePedido(pedidoId) {
    if (this.socket) {
      this.socket.emit('leave-pedido', pedidoId);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
