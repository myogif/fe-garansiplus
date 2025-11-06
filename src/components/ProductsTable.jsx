import { Info } from 'lucide-react';
import StatusPill from './StatusPill';

const ProductsTable = ({ products = [], onPageChange, pagination }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatus = (product) => {
    if (product.status) return product.status;
    if (product.isActive === true) return 'Active';
    if (product.isActive === false) return 'Expired';
    return 'Active';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nama Produk
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Kode Produk
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Harga Produk
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Garansi (%)
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.name || product.productName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.code || product.productCode || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.price ? formatCurrency(product.price) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.warranty
                      ? `${formatCurrency(product.warranty)} ( ${
                          product.warrantyPercentage || 3
                        } % )`
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={getStatus(product)} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Info className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
