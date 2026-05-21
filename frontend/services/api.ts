/**
 * Softmaster Technology Solutions Pvt Ltd
 * Shared API Service - Axios Instance
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem("access_token", access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Typed API helper functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, new_password: string) =>
    api.post("/auth/reset-password", { token, new_password }),
};

export const coursesAPI = {
  list: (params?: any) => api.get("/courses", { params }),
  get: (id: string) => api.get(`/courses/${id}`),
  create: (data: any) => api.post("/courses", data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  getProgress: (id: string) => api.get(`/courses/${id}/progress`),
  getCertificate: (id: string) => api.get(`/courses/${id}/certificate`),
};

export const jobsAPI = {
  list: (params?: any) => api.get("/jobs", { params }),
  get: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post("/jobs", data),
  apply: (id: string, data: any) => api.post(`/jobs/${id}/apply`, data),
  myApplications: () => api.get("/jobs/applications/mine"),
};

export const attendanceAPI = {
  checkIn: (data?: any) => api.post("/attendance/check-in", data),
  checkOut: (data?: any) => api.post("/attendance/check-out", data),
  getAttendance: (params?: any) => api.get("/attendance", { params }),
  applyleave: (data: any) => api.post("/attendance/leaves", data),
  getLeaves: (params?: any) => api.get("/attendance/leaves", { params }),
};

export const projectsAPI = {
  list: (params?: any) => api.get("/projects", { params }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post("/projects", data),
};

export const paymentsAPI = {
  createOrder: (data: any) => api.post("/payments/create-order", data),
  verifyPayment: (data: any) => api.post("/payments/verify", data),
  history: () => api.get("/payments/history"),
};

export const analyticsAPI = {
  studentDashboard: () => api.get("/analytics/student-dashboard"),
  adminDashboard: () => api.get("/analytics/admin-dashboard"),
  revenue: (params?: any) => api.get("/analytics/revenue", { params }),
};

export const notificationsAPI = {
  list: () => api.get("/notifications"),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/mark-all-read"),
};
