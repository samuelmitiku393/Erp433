import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add Telegram init data
api.interceptors.request.use(
  (config) => {
    const tg = window.Telegram?.WebApp;
    
    if (tg && tg.initData) {
      config.headers['Telegram-Init-Data'] = tg.initData;
    }
    
    // Add test user for development
    if (!tg) {
      config.params = {
        ...config.params,
        userId: 'test_user_123'
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message;
    
    // Show alert for critical errors
    if (error.response?.status === 401) {
      window.Telegram?.WebApp.showAlert('Session expired. Please restart the app.');
    }
    
    if (error.response?.status === 500) {
      window.Telegram?.WebApp.showAlert('Server error. Please try again later.');
    }
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url
    });
    
    return Promise.reject({
      success: false,
      error: errorMessage,
      status: error.response?.status
    });
  }
);

// Transaction API
export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getSummary: (params) => api.get('/transactions/summary/overview', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// Promotion API
export const promotionAPI = {
  create: (data) => api.post('/promotions', data),
  getAll: (params) => api.get('/promotions', { params }),
  getById: (id) => api.get(`/promotions/${id}`),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
  schedulePost: (id, data) => api.post(`/promotions/${id}/schedule-post`, data),
  updateStatus: (id, status) => api.put(`/promotions/${id}/status`, { status })
};

export default api;