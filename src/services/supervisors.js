import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/supervisors/products', { params });
  return response.data;
};
