import { jwtDecode } from 'jwt-decode';
import api from './api';

export const login = async (phone, password) => {
  const response = await api.post('/auth/login', { phone, password });
  const { token, user } = response.data.data;

  localStorage.setItem('gp_token', token);
  localStorage.setItem('gp_user', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');

  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('gp_token');
  localStorage.removeItem('gp_user');
  localStorage.removeItem('isLoggedIn');
};

export const decodeJWT = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);

    if (!decoded) {
      console.warn('⚠️ Could not decode JWT token');
      return false;
    }

    if (!decoded.exp) {
      console.log('ℹ️ Token has no expiration field - treating as valid');
      return false;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;

    if (isExpired) {
      console.log('⏰ Token expired at:', new Date(decoded.exp * 1000));
    }

    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('gp_user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    console.log('📦 Retrieved user from storage:', user?.role);
    return user;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('gp_token');
};

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
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
