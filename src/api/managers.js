import client from './client';

export const getDashboardSummary = () => client.get('/api/managers/dashboard');
export const getMonthlySummary = () => client.get('/api/managers/products/monthly-summary');
