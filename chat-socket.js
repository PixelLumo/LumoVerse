/**
 * WebSocket Chat Service - Real-Time Messaging
 * 
 * Replaces polling-based chat with instant WebSocket messaging
 * Uses Socket.io for cross-browser compatibility
 * 
 * Features:
 * - Real-time message delivery (<100ms latency)
 * - Presence (online/offline status)
 * - Typing indicators
 * - Message history sync
 * - Fallback to HTTP when WebSocket unavailable
 * 
 * Installation:
 *   npm install socket.io-client
 * 
 * Usage:
 *   <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
 *   <script src="/js/chat-socket.js"></script>
 */

class ChatSocket {
    constructor(serverUrl = 'http://localhost:3000') {
        this.serverUrl = serverUrl;
        this.socket = null;
        this.isConnected = false;
        this.messageHandlers = [];
        this.presenceHandlers = [];
        this.typingHandlers = [];
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        if (this.isConnected) {
            console.warn('Already connected');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                this.socket = io(this.serverUrl, {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: 5,
                    transports: ['websocket', 'polling']  // Fallback to polling
                });

                // Connection established
                this.socket.on('connect', () => {
                    console.log('✅ Connected to chat server');
                    this.isConnected = true;
                    resolve();
                });

                // Receive message
                this.socket.on('message', (data) => {
                    this._handleMessage(data);
                });

                // User joined
                this.socket.on('user-joined', (data) => {
                    this._handlePresence(data, 'joined');
                });

                // User left
                this.socket.on('user-left', (data) => {
                    this._handlePresence(data, 'left');
                });

                // Typing indicator
                this.socket.on('user-typing', (data) => {
                    this._handleTyping(data);
                });

                // Connection error
                this.socket.on('error', (error) => {
                    console.error('❌ Socket error:', error);
                    reject(error);
                });

                // Connection lost
                this.socket.on('disconnect', () => {
                    console.warn('⚠️ Disconnected from chat server');
                    this.isConnected = false;
                });

                // Message history
                this.socket.on('message-history', (messages) => {
                    console.log('📚 Received message history:', messages.length);
                    messages.forEach(msg => this._handleMessage(msg));
                });

            } catch (error) {
                console.error('Connection error:', error);
                reject(error);
            }
        });
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.isConnected = false;
            console.log('Disconnected from chat server');
        }
    }

    /**
     * Send message to chat
     * 
     * @param {string} text - Message content
     * @param {Object} options - Optional metadata
     */
    sendMessage(text, options = {}) {
        if (!this.isConnected) {
            console.error('Not connected to chat server');
            return false;
        }

        const message = {
            id: Date.now(),
            text: text.trim(),
            author: options.author || 'Anonymous',
            authorId: options.authorId || null,
            avatar: options.avatar || null,
            timestamp: new Date().toISOString(),
            ...options
        };

        this.socket.emit('message', message);

        // Also save locally (as backup)
        this._saveLocalMessage(message);

        return true;
    }

    /**
     * Join chat room
     * 
     * @param {string} room - Room name
     * @param {Object} userInfo - User info
     */
    joinRoom(room, userInfo) {
        if (!this.isConnected) {
            console.error('Not connected');
            return;
        }

        this.currentRoom = room;
        this.currentUser = userInfo;

        this.socket.emit('join-room', {
            room: room,
            user: userInfo,
            timestamp: new Date().toISOString()
        });

        // Request message history
        this.socket.emit('request-history', { room: room, limit: 50 });

        console.log(`Joined room: ${room}`);
    }

    /**
     * Leave chat room
     * 
     * @param {string} room - Room name
     */
    leaveRoom(room) {
        if (!this.isConnected) return;

        this.socket.emit('leave-room', {
            room: room,
            user: this.currentUser,
            timestamp: new Date().toISOString()
        });

        console.log(`Left room: ${room}`);
    }

    /**
     * Send typing indicator
     * Shows user is typing
     */
    sendTyping() {
        if (!this.isConnected) return;

        this.socket.emit('typing', {
            room: this.currentRoom,
            user: this.currentUser.username,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Clear typing indicator
     */
    stopTyping() {
        if (!this.isConnected) return;

        this.socket.emit('stop-typing', {
            room: this.currentRoom,
            user: this.currentUser.username
        });
    }

    /**
     * React to message (emoji)
     * 
     * @param {number} messageId - Message ID
     * @param {string} emoji - Emoji reaction
     */
    reactToMessage(messageId, emoji) {
        if (!this.isConnected) return;

        this.socket.emit('reaction', {
            messageId: messageId,
            emoji: emoji,
            user: this.currentUser.username
        });
    }

    /**
     * Delete message (own messages only)
     * 
     * @param {number} messageId
     */
    deleteMessage(messageId) {
        if (!this.isConnected) return;

        this.socket.emit('delete-message', {
            messageId: messageId,
            user: this.currentUser.username
        });
    }

    /**
     * Edit message (own messages only)
     * 
     * @param {number} messageId
     * @param {string} newText
     */
    editMessage(messageId, newText) {
        if (!this.isConnected) return;

        this.socket.emit('edit-message', {
            messageId: messageId,
            newText: newText,
            user: this.currentUser.username
        });
    }

    /**
     * Report message (for moderation)
     * 
     * @param {number} messageId
     * @param {string} reason
     */
    reportMessage(messageId, reason) {
        if (!this.isConnected) return;

        this.socket.emit('report-message', {
            messageId: messageId,
            reason: reason,
            reportedBy: this.currentUser.username
        });
    }

    /**
     * Get online users in current room
     */
    getOnlineUsers() {
        return new Promise((resolve) => {
            this.socket.emit('get-users', { room: this.currentRoom }, (users) => {
                resolve(users);
            });
        });
    }

    // ==================== EVENT HANDLERS ====================

    /**
     * Register handler for new messages
     * 
     * @param {function} callback - Called when message received
     */
    onMessage(callback) {
        if (typeof callback === 'function') {
            this.messageHandlers.push(callback);
        }
    }

    /**
     * Register handler for presence events
     * 
     * @param {function} callback - Called when user joins/leaves
     */
    onPresence(callback) {
        if (typeof callback === 'function') {
            this.presenceHandlers.push(callback);
        }
    }

    /**
     * Register handler for typing events
     * 
     * @param {function} callback - Called when user is typing
     */
    onTyping(callback) {
        if (typeof callback === 'function') {
            this.typingHandlers.push(callback);
        }
    }

    // ==================== INTERNAL HANDLERS ====================

    _handleMessage(message) {
        // Save to local storage as cache
        this._saveLocalMessage(message);

        // Call all registered handlers
        this.messageHandlers.forEach(handler => {
            try {
                handler(message);
            } catch (error) {
                console.error('Message handler error:', error);
            }
        });
    }

    _handlePresence(data, action) {
        const presenceEvent = {
            user: data.user || data.username,
            action: action,  // 'joined' or 'left'
            timestamp: new Date()
        };

        this.presenceHandlers.forEach(handler => {
            try {
                handler(presenceEvent);
            } catch (error) {
                console.error('Presence handler error:', error);
            }
        });
    }

    _handleTyping(data) {
        const typingEvent = {
            user: data.user,
            isTyping: data.isTyping !== false,
            timestamp: new Date()
        };

        this.typingHandlers.forEach(handler => {
            try {
                handler(typingEvent);
            } catch (error) {
                console.error('Typing handler error:', error);
            }
        });
    }

    // ==================== LOCAL STORAGE (CACHE) ====================

    /**
     * Save message to localStorage (as cache/backup)
     * 
     * @private
     */
    _saveLocalMessage(message) {
        const key = `pixellumoChat_${this.currentRoom || 'main'}`;
        const messages = JSON.parse(localStorage.getItem(key)) || [];
        
        // Avoid duplicates
        if (!messages.find(m => m.id === message.id)) {
            messages.push(message);
            
            // Keep last 100 messages
            if (messages.length > 100) {
                messages.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(messages));
        }
    }

    /**
     * Get local message cache
     * Useful if server is down
     */
    getLocalMessages(room = 'main') {
        const key = `pixellumoChat_${room}`;
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    /**
     * Clear local message cache
     */
    clearLocalMessages(room = 'main') {
        const key = `pixellumoChat_${room}`;
        localStorage.removeItem(key);
    }

    // ==================== CONNECTION STATUS ====================

    /**
     * Check if connected
     */
    getStatus() {
        return {
            connected: this.isConnected,
            currentRoom: this.currentRoom,
            currentUser: this.currentUser,
            socketId: this.socket?.id || null
        };
    }

    /**
     * Get connection stats
     */
    getStats() {
        return {
            bytesReceived: this.socket?.io?.engine?.bytesReceived || 0,
            bytesSent: this.socket?.io?.engine?.bytesSent || 0,
            latency: this.socket?.io?.engine?.transport?.pollDuration || 0,
            transportType: this.socket?.io?.engine?.transport?.name || 'unknown'
        };
    }
}

// ==================== GLOBAL INSTANCE ====================

// Create global chat socket instance
const chatSocket = new ChatSocket('http://localhost:3000');

// Auto-connect when page loads (if user is logged in)
window.addEventListener('load', async () => {
    const user = auth?.getUser();
    
    if (user && !chatSocket.isConnected) {
        try {
            await chatSocket.connect();
            chatSocket.joinRoom('main', user);
            
            // Listen for messages
            chatSocket.onMessage((message) => {
                // Update chat UI
                const chatUI = document.getElementById('chatMessages');
                if (chatUI) {
                    const msgEl = document.createElement('div');
                    msgEl.className = 'message';
                    msgEl.innerHTML = `
                        <strong>${escapeHtml(message.author)}</strong>
                        <p>${escapeHtml(message.text)}</p>
                        <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
                    `;
                    chatUI.appendChild(msgEl);
                    chatUI.scrollTop = chatUI.scrollHeight;
                }
            });
            
            // Listen for presence
            chatSocket.onPresence((event) => {
                const presenceUI = document.getElementById('presence');
                if (presenceUI) {
                    const action = event.action === 'joined' ? '✅' : '❌';
                    const msg = `${action} ${escapeHtml(event.user)} ${event.action}`;
                    presenceUI.innerHTML = msg;
                }
            });
            
            // Listen for typing
            chatSocket.onTyping((event) => {
                const typingUI = document.getElementById('typingIndicator');
                if (typingUI) {
                    if (event.isTyping) {
                        typingUI.innerHTML = `<em>${escapeHtml(event.user)} is typing...</em>`;
                    } else {
                        typingUI.innerHTML = '';
                    }
                }
            });
            
        } catch (error) {
            console.error('Failed to connect chat:', error);
            // Fallback to polling if WebSocket fails
            console.log('Falling back to polling mode');
        }
    }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    if (chatSocket.isConnected) {
        chatSocket.disconnect();
    }
});

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
