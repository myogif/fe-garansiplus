import client from './client';

export async function fetchProducts(role, { page = 1, limit = 10, mine = true, search = '' } = {}) {
  const searchParams = new URLSearchParams({
    page,
    limit,
  });
  if (search) {
    searchParams.append('search', search);
  }

  const url =
    role === 'MANAGER'        ? `/api/managers/products?${searchParams}` :
    role === 'SERVICE_CENTER' ? `/api/managers/products?${searchParams}` :
    role === 'SUPERVISOR'     ? `/api/supervisors/products?${searchParams}` :
                                `/api/sales/products?${searchParams}${mine ? '&mine=true' : ''}`;

  const res = await client.get(url);
  const data = res.data?.data || {};
  const items = (data.items ?? res.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.code,
    price: p.price,
    priceWarranty: p.priceWarranty,
    persen: p.persen,
    isActive: p.isActive,
    status: p.status || (typeof p.isActive === 'boolean' ? (p.isActive ? 'ACTIVE' : 'INACTIVE') : 'Unknown'),
    type: p.tipe,
    membership_number: p.nomorKepesertaan,
    description: p.notes,
    store_id: p.storeId,
    store: p.store,
    creator: p.creator,
    created_at: p.createdAt,
  }));

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

export const createProduct = (payload) => client.post('/api/sales/products', payload);
export const updateProduct = (id, payload) => client.put(`/api/sales/products/${id}`, payload);
export function deleteProduct(id, role) {
  if (role === 'SUPERVISOR') return client.delete(`/api/supervisors/products/${id}`);
  return client.delete(`/api/sales/products/${id}`);
}

export async function fetchProductByCode(role, code) {
  const url =
    role === 'MANAGER'        ? `/api/managers/products?code=${code}` :
    role === 'SERVICE_CENTER' ? `/api/managers/products?code=${code}` :
    role === 'SUPERVISOR'     ? `/api/supervisors/products?code=${code}` :
                                `/api/sales/products?code=${code}`;

  const res = await client.get(url);
  const data = res.data?.data || {};
  const items = data.items || [];

  if (items.length === 0) {
    throw new Error('Product not found');
  }

  const p = items[0];
  return {
    id: p.id,
    name: p.name,
    sku: p.code,
    code: p.code,
    type: p.tipe,
    price: p.price,
    priceWarranty: p.priceWarranty,
    status: p.status,
    persen: p.persen,
    notes: p.notes,
    description: p.notes,
    customer_name: p.customer_name,
    customer_phone: p.customer_phone,
    customer_email: p.customer_email,
    isActive: p.isActive,
    store_id: p.storeId,
    creator_id: p.creatorId,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    store: p.store,
    creator: p.creator,
  };
}

export async function exportManagerProductsToExcel({ code = '', created_at_from = '', created_at_to = '' } = {}) {
  const searchParams = new URLSearchParams({
    page: 1,
    limit: 10,
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

  const res = await client.get(`/api/managers/products?${searchParams}`, {
    responseType: 'blob',
  });

  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products_manager_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
