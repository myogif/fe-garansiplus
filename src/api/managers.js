import client from './client';

export const getDashboardSummary = () => client.get('/api/managers/dashboard');
export const getMonthlySummary = () => client.get('/api/managers/products/monthly-summary');

export async function fetchStores() {
  const res = await client.get('/api/toko');
  return res.data?.data || [];
}

export async function getStores(page = 1, limit = 10, search = '') {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await client.get('/api/managers/stores', { params });
  return res.data?.data || { items: [], pagination: null };
}

export async function createStore(storeData) {
  const res = await client.post('/api/managers/stores', storeData);
  return res.data?.data;
}

export const deleteStore = (id) => client.delete(`/api/toko/${id}`);
