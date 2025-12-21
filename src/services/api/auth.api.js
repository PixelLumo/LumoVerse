import apiClient from './apiClient';

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  verify: () => apiClient.get('/auth/verify'),
};

export const communityAPI = {
  getAll: () => apiClient.get('/community'),
  getById: (id) => apiClient.get(`/community/${id}`),
  create: (data) => apiClient.post('/community', data),
};

export const chatAPI = {
  getMessages: (conversationId) => apiClient.get(`/chat/${conversationId}`),
  sendMessage: (conversationId, message) => apiClient.post(`/chat/${conversationId}`, { message }),
};

export const userAPI = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
  getLeaderboard: () => apiClient.get('/user/leaderboard'),
};

export const notificationAPI = {
  getAll: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}`),
};
