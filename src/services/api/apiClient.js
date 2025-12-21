import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../../config/env';
import { STORAGE_KEYS, API_TIMEOUT } from '../../config/constants';

const apiClient = axios.create({
  baseURL: ENV.apiUrl,
  timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
