'use client';

import { io } from 'socket.io-client';
import { logInfo, logError } from '@/lib/logger';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const initSocket = () => {
  if (typeof window !== 'undefined' && !socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      logInfo('Socket conectado:', socket.id);
    });

    socket.on('disconnect', () => {
      logInfo('Socket desconectado');
    });

    socket.on('connect_error', (error) => {
      logError('Error de conexión socket:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const socketService = {
  initSocket,
  getSocket,
  disconnectSocket
};

export default socketService;
