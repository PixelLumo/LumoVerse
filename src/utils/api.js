import { apiService } from './services';

export const communityAPI = {
  getAll: () => apiService.get('/communities'),
  getById: (id) => apiService.get(`/communities/${id}`),
  join: (id) => apiService.post(`/communities/${id}/join`, {}),
  leave: (id) => apiService.post(`/communities/${id}/leave`, {}),
};

export const chatAPI = {
  getMessages: (roomId, page=1) => apiService.get(`/chat/messages?roomId=${roomId}&page=${page}`),
  sendMessage: (roomId, message) => apiService.post('/chat/messages', { roomId, message }),
  getRooms: () => apiService.get('/chat/rooms'),
};

export const userAPI = {
  getProfile: (userId) => apiService.get(`/users/${userId}`),
  updateProfile: (data) => apiService.put('/users/profile', data),
  getLeaderboard: (page=1) => apiService.get(`/users/leaderboard?page=${page}`),
  getStats: (userId) => apiService.get(`/users/${userId}/stats`),
};

export const galleryAPI = {
  getAll: (page=1) => apiService.get(`/gallery?page=${page}`),
  getById: (id) => apiService.get(`/gallery/${id}`),
  upload: (formData) => apiService.post('/gallery/upload', formData, {'Content-Type':'multipart/form-data'}),
  like: (id) => apiService.post(`/gallery/${id}/like`, {}),
  comment: (id, comment) => apiService.post(`/gallery/${id}/comments`, { comment }),
};

export const blogAPI = {
  getAll: (page=1) => apiService.get(`/blog?page=${page}`),
  getById: (id) => apiService.get(`/blog/${id}`),
  create: (data) => apiService.post('/blog', data),
  update: (id, data) => apiService.put(`/blog/${id}`, data),
  delete: (id) => apiService.delete(`/blog/${id}`),
};

export const notificationAPI = {
  getAll: (page=1) => apiService.get(`/notifications?page=${page}`),
  markAsRead: (id) => apiService.post(`/notifications/${id}/read`, {}),
  markAllAsRead: () => apiService.post('/notifications/read-all', {}),
  delete: (id) => apiService.delete(`/notifications/${id}`),
};

export const messageAPI = {
  getConversations: (page=1) => apiService.get(`/messages/conversations?page=${page}`),
  getMessages: (id, page=1) => apiService.get(`/messages/conversations/${id}?page=${page}`),
  sendMessage: (id, message) => apiService.post(`/messages/conversations/${id}`, { message }),
  startConversation: (userId) => apiService.post('/messages/conversations', { userId }),
};
