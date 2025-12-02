import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://garansiplus.com',
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('gp_token') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      const isLoginRequest = err.config.url.includes('/auth/login');

      if (!isLoginRequest) {
        localStorage.removeItem('gp_token');
        localStorage.removeItem('gp_user');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');

        const event = new CustomEvent('auth:expired', {
          detail: { message: 'Sesi berakhir. Silakan login kembali.' },
        });
        window.dispatchEvent(event);

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    const msg = err?.response?.data?.message || err.message || 'Request failed';
    console.error(msg);
    return Promise.reject(err);
  }
);

export default client;
