/**
 * Softmaster API Client
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Auth service
export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; full_name: string; phone?: string }) =>
    apiClient.post('/auth/register', data),
  logout: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },
  getMe: () => apiClient.get('/auth/me'),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.post('/auth/change-password', data),
};

// Courses service
export const coursesService = {
  list: (params?: { skip?: number; limit?: number; category?: string }) =>
    apiClient.get('/courses', { params }),
  get: (id: number) => apiClient.get(`/courses/${id}`),
  enroll: (courseId: number) => apiClient.post(`/courses/${courseId}/enroll`),
  getProgress: (courseId: number) => apiClient.get(`/courses/${courseId}/progress`),
};

// Jobs service
export const jobsService = {
  list: (params?: { skip?: number; limit?: number; type?: string }) =>
    apiClient.get('/jobs', { params }),
  get: (id: number) => apiClient.get(`/jobs/${id}`),
  apply: (jobId: number, data: FormData) =>
    apiClient.post(`/jobs/${jobId}/apply`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Users service
export const usersService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: Record<string, unknown>) => apiClient.put('/users/profile', data),
  uploadAvatar: (formData: FormData) =>
    apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
