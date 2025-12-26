/**
 * StorageService - Abstraction layer for data persistence
 * 
 * Supports both localStorage (client-side) and API (backend) storage
 * Switch between them by changing useBackend flag without changing app code
 * 
 * Usage:
 *   const storage = new StorageService(useBackend = false);
 *   const posts = await storage.getPosts();
 *   await storage.addPost(newPost);
 */

class StorageService {
    constructor(useBackend = false) {
        this.useBackend = useBackend;
        // Ensure API_BASE is defined, otherwise use default
        if (typeof API_BASE === 'undefined') {
            console.warn('⚠️ API_BASE not defined, using default http://localhost:5000');
            window.API_BASE = 'http://localhost:5000';
        }
        this.baseURL = window.API_BASE || 'http://localhost:5000';
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.cache = new Map();
        console.log('StorageService initialized with baseURL:', this.baseURL);
    }

    // ==================== AUTHENTICATION ====================

    /**
     * Login user with email/password
     * Backend: Verifies credentials and returns JWT token
     * LocalStorage: Simple session storage (demo only)
     */
    async login(email, password) {
        if (this.useBackend) {
            try {
                const response = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email.split('@')[0], password })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Login failed');
                }
                
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('pixellumoUser', JSON.stringify(data.user));
                sessionStorage.setItem('pixellumoUser', JSON.stringify(data.user));
                
                return { token: data.token, user: data.user };
            } catch (error) {
                console.error('Backend login error:', error);
                throw error;
            }
        } else {
            // Demo: Look up actual username from email
            let emailMap = JSON.parse(localStorage.getItem('pixellumoEmailMap') || '{}');
            const username = emailMap[email.toLowerCase()] || email.split('@')[0];
            
            const user = {
                email,
                username: username,
                id: email,
                avatar: `https://i.pravatar.cc/150?img=${Math.random()}`,
                role: 'user'
            };
            
            sessionStorage.setItem('pixellumoUser', JSON.stringify(user));
            localStorage.setItem('pixellumoUser', JSON.stringify(user));
            
            return { token: null, user };
        }
    }

    /**
     * Register new user
     */
    async register(email, password, username) {
        if (this.useBackend) {
            try {
                const response = await fetch(`${this.baseURL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, username })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Registration failed');
                }
                
                const data = await response.json();
                return { success: true, ...data };
            } catch (error) {
                console.error('Backend registration error:', error);
                throw error;
            }
        } else {
            // Demo: Just store user
            const user = {
                email,
                username,
                id: email,
                avatar: `https://i.pravatar.cc/150?img=${Math.random()}`
            };
            
            localStorage.setItem('pixellumoUser', JSON.stringify(user));
            
            // Store email-to-username mapping for login lookup
            let emailMap = JSON.parse(localStorage.getItem('pixellumoEmailMap') || '{}');
            emailMap[email.toLowerCase()] = username;
            localStorage.setItem('pixellumoEmailMap', JSON.stringify(emailMap));
            
            return { user };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        console.log('[StorageService.logout] Called, useBackend:', this.useBackend);
        if (this.useBackend) {
            const token = localStorage.getItem('authToken');
            console.log('[StorageService.logout] Token:', token);
            if (token) {
                try {
                    const resp = await fetch(`${this.baseURL}/auth/logout`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log('[StorageService.logout] Backend response:', resp.status);
                } catch (error) {
                    console.error('[StorageService.logout] Logout error:', error);
                }
            } else {
                console.warn('[StorageService.logout] No authToken found');
            }
            localStorage.removeItem('authToken');
        }
        sessionStorage.removeItem('pixellumoUser');
        this.cache.clear();
    }

    /**
     * Get current auth token (for API requests)
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    // ==================== POSTS ====================

    /**
     * Get all posts with caching
     */
    async getPosts() {
        const cacheKey = 'posts';
        
        // Check cache first (only for backend)
        if (this.useBackend && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.time < this.cacheTimeout) {
                return cached.data;
            }
        }

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/posts`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (!response.ok) throw new Error('Failed to fetch posts');
                const posts = await response.json();
                
                // Cache result
                this.cache.set(cacheKey, { data: posts, time: Date.now() });
                return posts;
            } catch (error) {
                console.error('Backend fetch posts error:', error);
                // Fallback to localStorage
                return JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
            }
        } else {
            return JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
        }
    }

    /**
     * Add new post
     */
    async addPost(post) {
        const postWithId = {
            ...post,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: []
        };

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postWithId)
                });
                
                if (!response.ok) throw new Error('Failed to create post');
                const result = await response.json();
                
                // Invalidate cache
                this.cache.delete('posts');
                return result;
            } catch (error) {
                console.error('Backend add post error:', error);
                throw error;
            }
        } else {
            const posts = JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
            posts.unshift(postWithId);
            localStorage.setItem('pixellumoPosts', JSON.stringify(posts));
            return postWithId;
        }
    }

    /**
     * Like/unlike post
     */
    async togglePostLike(postId) {
        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/posts/${postId}/like`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Failed to like post');
                this.cache.delete('posts');
                return await response.json();
            } catch (error) {
                console.error('Backend toggle like error:', error);
                throw error;
            }
        } else {
            const posts = JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.likes = (post.likes || 0) + 1;
                localStorage.setItem('pixellumoPosts', JSON.stringify(posts));
            }
            return post;
        }
    }

    /**
     * Add comment to post
     */
    async addComment(postId, comment) {
        const commentWithId = {
            ...comment,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(commentWithId)
                });
                
                if (!response.ok) throw new Error('Failed to add comment');
                this.cache.delete('posts');
                return await response.json();
            } catch (error) {
                console.error('Backend add comment error:', error);
                throw error;
            }
        } else {
            const posts = JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.comments = post.comments || [];
                post.comments.push(commentWithId);
                localStorage.setItem('pixellumoPosts', JSON.stringify(posts));
            }
            return commentWithId;
        }
    }

    // ==================== MESSAGES ====================

    /**
     * Get private messages with a user
     */
    async getMessages(userId) {
        const cacheKey = `messages_${userId}`;

        if (this.useBackend && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.time < this.cacheTimeout) {
                return cached.data;
            }
        }

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/messages/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Failed to fetch messages');
                const messages = await response.json();
                this.cache.set(cacheKey, { data: messages, time: Date.now() });
                return messages;
            } catch (error) {
                console.error('Backend fetch messages error:', error);
                return [];
            }
        } else {
            const key = `pixellumoMessages_${userId}`;
            return JSON.parse(localStorage.getItem(key)) || [];
        }
    }

    /**
     * Send private message
     */
    async sendMessage(userId, message) {
        const messageWithId = {
            ...message,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false
        };

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/messages/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(messageWithId)
                });
                
                if (!response.ok) throw new Error('Failed to send message');
                this.cache.delete(`messages_${userId}`);
                return await response.json();
            } catch (error) {
                console.error('Backend send message error:', error);
                throw error;
            }
        } else {
            const key = `pixellumoMessages_${userId}`;
            const messages = JSON.parse(localStorage.getItem(key)) || [];
            messages.push(messageWithId);
            localStorage.setItem(key, JSON.stringify(messages));
            return messageWithId;
        }
    }

    // ==================== CHAT ====================

    /**
     * Get group chat messages
     */
    async getChat() {
        const cacheKey = 'chat';

        if (this.useBackend && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.time < this.cacheTimeout) {
                return cached.data;
            }
        }

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/chat`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (!response.ok) throw new Error('Failed to fetch chat');
                const messages = await response.json();
                this.cache.set(cacheKey, { data: messages, time: Date.now() });
                return messages;
            } catch (error) {
                console.error('Backend fetch chat error:', error);
                return [];
            }
        } else {
            return JSON.parse(localStorage.getItem('pixellumoChat')) || [];
        }
    }

    /**
     * Send chat message
     */
    async sendChat(message) {
        const messageWithId = {
            ...message,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };

        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(messageWithId)
                });
                
                if (!response.ok) throw new Error('Failed to send chat');
                this.cache.delete('chat');
                return await response.json();
            } catch (error) {
                console.error('Backend send chat error:', error);
                throw error;
            }
        } else {
            const messages = JSON.parse(localStorage.getItem('pixellumoChat')) || [];
            messages.push(messageWithId);
            localStorage.setItem('pixellumoChat', JSON.stringify(messages));
            return messageWithId;
        }
    }

    // ==================== IMAGES ====================

    /**
     * Upload image (backend: to cloud storage, local: base64)
     */
    async uploadImage(file) {
        if (this.useBackend) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                
                if (!response.ok) throw new Error('Upload failed');
                const { url } = await response.json();
                return url; // Just return URL, not base64
            } catch (error) {
                console.error('Backend upload error:', error);
                throw error;
            }
        } else {
            // Local: Convert to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
    }

    /**
     * Get images
     */
    async getImages() {
        if (this.useBackend) {
            try {
                const token = this.getAuthToken();
                const response = await fetch(`${this.baseURL}/images`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (!response.ok) throw new Error('Failed to fetch images');
                return await response.json();
            } catch (error) {
                console.error('Backend fetch images error:', error);
                return [];
            }
        } else {
            return JSON.parse(localStorage.getItem('pixellumoImages')) || [];
        }
    }

    // ==================== UTILITIES ====================

    /**
     * Get storage usage statistics
     */
    getStorageStats() {
        let total = 0;
        const breakdown = {};

        for (let key in localStorage) {
            if (key.startsWith('pixelllumo')) {
                const size = localStorage[key].length;
                total += size + key.length;
                breakdown[key] = `${(size / 1024).toFixed(2)} KB`;
            }
        }

        return {
            total: `${(total / 1024).toFixed(2)} KB / 5 MB`,
            breakdown,
            percentage: `${((total / (5 * 1024 * 1024)) * 100).toFixed(1)}%`
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Clear all local storage (dangerous!)
     */
    clearAllData() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('pixelllumo'));
        keys.forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
        this.cache.clear();
    }

    /**
     * Export data as JSON
     */
    exportData() {
        const data = {};
        for (let key in localStorage) {
            if (key.startsWith('pixelllumo')) {
                data[key] = JSON.parse(localStorage[key]);
            }
        }
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import data from JSON
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            for (let key in data) {
                localStorage.setItem(key, JSON.stringify(data[key]));
            }
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

// Create global instance
const storage = new StorageService(useBackend = true); // Using backend for persistent storage
