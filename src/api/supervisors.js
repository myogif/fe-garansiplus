import client from './client';

export async function listRolePeople(role, { page = 1, limit = 10 } = {}) {
  const url = role === 'MANAGER'
    ? `/api/managers/supervisors?page=${page}&limit=${limit}`
    // ? `/api/managers/supervisors?page=1&limit=10`
    : `/api/supervisors/sales?page=${page}&limit=${limit}`;

  const res = await client.get(url);
  const data = res.data?.data || {};
  const items = data.items ?? res.data?.items ?? [];
  const pg = data.pagination ?? {
    currentPage: Number(res.headers['x-page'] ?? page),
    itemsPerPage: Number(res.headers['x-per-page'] ?? limit),
    totalItems: Number(res.headers['x-total-count'] ?? items.length),
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  return { items, pagination: pg };
}

export const createSupervisor = (payload) => client.post('/api/managers/add-supervisors', payload);
export const deleteSupervisor = (id) => client.delete(`/api/managers/supervisors/${id}`);

export const createSalesUser = (payload) => client.post('/api/supervisors/sales', payload);
export const deleteSalesUser = (id) => client.delete(`/api/supervisors/sales/${id}`);
