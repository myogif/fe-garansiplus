import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or from your auth store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || 'Request failed';
    console.error(msg);
    return Promise.reject(err);
  }
);

export default client;
