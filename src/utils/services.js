import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Storage Service
export const storageService = {
  async setItem(key, value) {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); return true; } 
    catch (error) { console.error('Storage error:', error); return false; }
  },
  async getItem(key) {
    try { const value = await AsyncStorage.getItem(key); return value ? JSON.parse(value) : null; } 
    catch (error) { console.error('Storage error:', error); return null; }
  },
  async removeItem(key) { try { await AsyncStorage.removeItem(key); return true; } catch { return false; } },
  async clearAll() { try { await AsyncStorage.clear(); return true; } catch { return false; } },
};

// API Service
export const apiService = {
  async request(method, endpoint, data = null, headers = {}) {
    try {
      const token = await storageService.getItem('authToken');
      const config = { method, url: `${API_BASE_URL}${endpoint}`, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...headers } };
      if (data && ['POST','PUT','PATCH'].includes(method)) config.data = data;
      const response = await axios(config); return response.data;
    } catch (error) { console.error('API Error:', error); throw error; }
  },
  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, data) { return this.request('POST', endpoint, data); },
  put(endpoint, data) { return this.request('PUT', endpoint, data); },
  patch(endpoint, data) { return this.request('PATCH', endpoint, data); },
  delete(endpoint) { return this.request('DELETE', endpoint); },
};

// Auth Service
export const authService = {
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    await storageService.setItem('authToken', response.token);
    await storageService.setItem('user', response.user);
    return response;
  },
  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    await storageService.setItem('authToken', response.token);
    await storageService.setItem('user', response.user);
    return response;
  },
  async logout() { await storageService.removeItem('authToken'); await storageService.removeItem('user'); return true; },
  async isAuthenticated() { const token = await storageService.getItem('authToken'); return !!token; },
  async getCurrentUser() { return storageService.getItem('user'); },
};

// Utility Service
export const utilityService = {
  formatDate: (date) => new Date(date).toLocaleDateString(),
  formatTime: (date) => new Date(date).toLocaleTimeString(),
  getDaysSince: (date) => Math.ceil(Math.abs(new Date() - new Date(date)) / (1000*60*60*24)),
  truncateText: (text, length) => text.length > length ? text.substring(0,length)+'...' : text,
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
};
