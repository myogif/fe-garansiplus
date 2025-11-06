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
    role === 'MANAGER'    ? `/api/managers/products?${searchParams}` :
    role === 'SUPERVISOR' ? `/api/supervisors/products?${searchParams}` :
                            `/api/sales/products?${searchParams}${mine ? '&mine=true' : ''}`;

  const res = await client.get(url);
  const data = res.data?.data || {};
  const items = (data.items ?? res.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.code,
    price: p.price,
    status: typeof p.status === 'boolean' ? (p.status ? 'ACTIVE' : 'INACTIVE') : p.status,
    type: p.tipe,
    membership_number: p.nomor_kepesertaan,
    description: p.description,
    store_id: p.store_id,
    created_at: p.created_at,
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
  return client.delete(`/api/sales/products/${id}`); // SALES
}
