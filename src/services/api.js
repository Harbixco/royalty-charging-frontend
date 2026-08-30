import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('royalty_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the { success, message, data } envelope and normalize errors
// into a plain Error with a readable message, so calling code never
// has to reach into response.data.data.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ---- Authentication ----
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// ---- Charging records ----
export const chargingApi = {
  getNextTag: () => api.get('/charging/next-tag'),
  list: (params) => api.get('/charging', { params }),
  getById: (id) => api.get(`/charging/${id}`),
  lookupByTag: (tagNumber) => api.get(`/charging/lookup/${encodeURIComponent(tagNumber)}`),
  create: (payload) => api.post('/charging', payload),
  update: (id, payload) => api.put(`/charging/${id}`, payload),
  updateStatus: (id, status) => api.patch(`/charging/${id}/status`, { status }),
  complete: (id, payload) => api.patch(`/charging/${id}/complete`, payload),
  updatePayment: (id, paymentStatus) => api.patch(`/charging/${id}/payment`, { paymentStatus }),
  remove: (id) => api.delete(`/charging/${id}`),
};

// ---- Pricing ----
export const pricingApi = {
  list: () => api.get('/pricing'),
  create: (payload) => api.post('/pricing', payload),
  update: (id, payload) => api.put(`/pricing/${id}`, payload),
  remove: (id) => api.delete(`/pricing/${id}`),
  resetDefaults: () => api.post('/pricing/reset'),
};

// ---- Dashboard ----
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
};

export default api;
