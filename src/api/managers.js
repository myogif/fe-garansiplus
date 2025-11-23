import client from './client';

export const getDashboardSummary = () => client.get('/api/managers/dashboard');
export const getMonthlySummary = () => client.get('/api/managers/products/monthly-summary');

export async function fetchStores() {
  const res = await client.get('/api/toko');
  return res.data?.data || [];
}
