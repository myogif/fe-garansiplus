import client from './client';

export async function fetchSalesProducts({ page = 1, limit = 10, code = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  const searchParams = new URLSearchParams({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  if (code) {
    searchParams.append('code', code);
  }

  const res = await client.get(`/api/sales/products?${searchParams}`);
  const data = res.data?.data || {};

  const items = (data.items ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.tipe,
    code: p.code,
    membership_number: p.nomor_kepesertaan,
    price: p.price,
    priceWarranty: p.priceWarranty,
    status: p.status,
    persen: p.persen,
    notes: p.notes,
    customer_name: p.customer_name,
    customer_phone: p.customer_phone,
    customer_email: p.customer_email,
    store_id: p.storeId,
    creator_id: p.creatorId,
    is_active: p.isActive,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    store: p.store,
    creator: p.creator,
  }));

  const pagination = data.pagination ?? {
    currentPage: page,
    itemsPerPage: limit,
    totalItems: items.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return { items, pagination };
}

export async function fetchSalesProductDetail(code) {
  const res = await client.get(`/api/sales/products?code=${code}&limit=1`);
  const data = res.data?.data || {};
  const items = data.items || [];

  if (items.length === 0) {
    throw new Error('Product not found');
  }

  const p = items[0];
  return {
    id: p.id,
    name: p.name,
    type: p.tipe,
    code: p.code,
    membership_number: p.nomor_kepesertaan,
    price: p.price,
    priceWarranty: p.priceWarranty,
    status: p.status,
    persen: p.persen,
    notes: p.notes,
    customer_name: p.customer_name,
    customer_phone: p.customer_phone,
    customer_email: p.customer_email,
    store_id: p.storeId,
    creator_id: p.creatorId,
    is_active: p.isActive,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    store: p.store,
    creator: p.creator,
  };
}

export async function exportSalesProductsToExcel({ code = '', created_at_from = '', created_at_to = '' } = {}) {
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

  const res = await client.get(`/api/sales/products?${searchParams}`, {
    responseType: 'blob',
  });

  const blob = new Blob([res.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products_sales_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function updateSalesProduct(id, payload) {
  const res = await client.put(`/api/sales/products/${id}`, {
    name: payload.name,
    tipe: payload.type || payload.tipe,
    code: payload.code,
    price: payload.price,
    notes: payload.notes,
    persen: payload.persen,
    isActive: payload.isActive,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    customer_email: payload.customer_email,
  });
  return res.data;
}

export async function deleteSalesProduct(id) {
  const res = await client.delete(`/api/sales/products/${id}`);
  return res.data;
}
