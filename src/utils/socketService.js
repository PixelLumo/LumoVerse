import io from 'socket.io-client';

class SocketService {
  constructor() { this.socket = null; }

  async connect(token) {
    return new Promise((resolve, reject) => {
      try {
        const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
        this.socket = io(socketUrl, { auth: { token }, reconnection:true, reconnectionDelay:1000, reconnectionDelayMax:5000, reconnectionAttempts:5 });
        this.socket.on('connect', () => { console.log('Socket connected:', this.socket.id); resolve(this.socket); });
        this.socket.on('connect_error', (error) => { console.error('Socket error:', error); reject(error); });
      } catch (error) { reject(error); }
    });
  }

  disconnect() { if (this.socket) { this.socket.disconnect(); this.socket=null; } }
  onMessageReceived(cb) { if (this.socket) this.socket.on('message', cb); }
  onUserTyping(cb) { if (this.socket) this.socket.on('user:typing', cb); }
  onUserOnline(cb) { if (this.socket) this.socket.on('user:online', cb); }
  onUserOffline(cb) { if (this.socket) this.socket.on('user:offline', cb); }
  sendMessage(roomId, message) { if (this.socket) this.socket.emit('message:send', { roomId, message }); }
  sendTyping(roomId) { if (this.socket) this.socket.emit('user:typing', { roomId }); }
  joinRoom(roomId) { if (this.socket) this.socket.emit('room:join', { roomId }); }
  leaveRoom(roomId) { if (this.socket) this.socket.emit('room:leave', { roomId }); }
  isConnected() { return this.socket && this.socket.connected; }
}

export default new SocketService();
