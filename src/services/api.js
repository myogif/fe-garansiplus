import axios from 'axios';

const api = axios.create({
  baseURL: 'https://garansiplus.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gp_token');
      localStorage.removeItem('gp_user');

      const event = new CustomEvent('auth:expired', {
        detail: { message: 'Token expired' },
      });
      window.dispatchEvent(event);

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
