import client from './client';

export async function listRolePeople(role, { page = 1, limit = 10, search = '' } = {}) {
  const searchParams = new URLSearchParams({
    page,
    limit,
  });
  if (search) {
    searchParams.append('q', search);
  }

  const url = (role === 'MANAGER' || role === 'SERVICE_CENTER')
    ? `/api/managers/supervisors?${searchParams}`
    : `/api/supervisors/sales?${searchParams}`;

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
export const getSupervisorById = (id) => client.get(`/api/managers/supervisors/${id}`);
export const updateSupervisor = (id, payload) => client.put(`/api/managers/supervisors/${id}`, payload);
export const deleteSupervisor = (id) => client.delete(`/api/managers/supervisors/${id}`);

export const createSalesUser = (payload) => client.post('/api/supervisors/sales', payload);
export const deleteSalesUser = (id) => client.delete(`/api/supervisors/sales/${id}`);

export async function exportSupervisorProductsToExcel({ code = '', created_at_from = '', created_at_to = '', store_id = '' } = {}) {
  const searchParams = new URLSearchParams({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    export: 'excel',
  });

  if (code) {
    searchParams.append('code', code);
  }
  if (created_at_from) {
    searchParams.append('created_at_from', created_at_from);
  }
  if (created_at_to) {
    searchParams.append('created_at_to', created_at_to);
  }
  if (store_id && store_id !== 'ALL') {
    searchParams.append('store_id', store_id);
  }

  const res = await client.get(`/api/supervisors/products?${searchParams}`, {
    responseType: 'blob',
  });

  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products_supervisor_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function listSalesUsers(role, { page = 1, limit = 10, search = '' } = {}) {
  const searchParams = new URLSearchParams({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  if (search) {
    searchParams.append('q', search);
  }

  const url = (role === 'MANAGER' || role === 'SERVICE_CENTER')
    ? `/api/managers/sales?${searchParams}`
    : `/api/supervisors/sales?${searchParams}`;

  const res = await client.get(url);

  if (role === 'SUPERVISOR') {
    const items = Array.isArray(res.data?.data) ? res.data.data : [];
    const pg = {
      currentPage: 1,
      itemsPerPage: items.length,
      totalItems: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
    return { items, pagination: pg };
  }

  const data = res.data?.data || {};
  const items = data.items ?? [];
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
