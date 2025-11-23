import { jwtDecode } from 'jwt-decode';
import api from './api';

export const login = async (phone, password) => {
  const response = await api.post('/auth/login', { phone, password });
  const { token, user } = response.data.data;

  localStorage.setItem('gp_token', token);
  localStorage.setItem('gp_user', JSON.stringify(user));

  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('gp_token');
  localStorage.removeItem('gp_user');
};

export const decodeJWT = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('gp_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('gp_token');
};

export const getRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

export const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
