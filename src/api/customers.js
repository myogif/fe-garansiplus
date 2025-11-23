import client from './client';

export async function fetchCustomers({ page = 1, limit = 10, search = '' } = {}) {
  const searchParams = new URLSearchParams({
    page,
    limit,
  });
  if (search) {
    searchParams.append('search', search);
  }

  const url = `/api/managers/products?${searchParams}`;
  const res = await client.get(url);
  const data = res.data?.data || {};

  const items = (data.items ?? res.data ?? []).map((p) => ({
    id: p.id,
    name: p.customerName,
    phone: p.customerPhone,
    email: p.customerEmail,
    membershipNumber: p.nomorKepesertaan,
    productName: p.name,
    productCode: p.code,
    createdAt: p.createdAt,
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

export async function downloadCertificate(warrantyId) {
  const response = await client.get(`/api/warranties/${warrantyId}/certificate`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `certificate-${warrantyId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
