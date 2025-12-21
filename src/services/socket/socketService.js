import io from 'socket.io-client';
import ENV from '../../config/env';
import { SOCKET_EVENTS } from '../../config/constants';

let socket = null;

export const socketService = {
  connect: () => {
    if (!socket) {
      socket = io(ENV.socketUrl, { transports: ['websocket'] });
      socket.on('connect', () => console.log('Socket connected'));
      socket.on('disconnect', () => console.log('Socket disconnected'));
    }
    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  emit: (event, data) => {
    if (socket) socket.emit(event, data);
  },

  on: (event, callback) => {
    if (socket) socket.on(event, callback);
  },

  off: (event, callback) => {
    if (socket) socket.off(event, callback);
  },
};
