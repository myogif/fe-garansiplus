import api from './api';

export const getDashboard = async () => {
  const response = await api.get('/managers/dashboard');
  return response.data.data;
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/managers/products', { params });
  return response.data;
};
