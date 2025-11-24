import { Info, Edit2, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsTable = ({ products, loading, role, onEdit, onDelete, onGunakan, onCetak }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-12 bg-gray-200 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { bg: 'bg-green-100', text: 'text-green-700', label: 'Aktif' },
      'Aktif': { bg: 'bg-green-100', text: 'text-green-700', label: 'Aktif' },
      'USED': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Used' },
      'Used': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Used' },
      'INACTIVE': { bg: 'bg-red-100', text: 'text-red-700', label: 'Expired' },
      'Expired': { bg: 'bg-red-100', text: 'text-red-700', label: 'Expired' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status || 'Unknown' };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Nama Produk
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Kode Produk
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Harga Produk
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Garansi (%)
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm text-gray-900">
                {product.name}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {product.sku}
              </td>
              <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                {formatPrice(product.price)}
              </td>
              <td className="py-4 px-4 text-sm text-gray-900">
                {formatPrice(product.priceWarranty)} ( {product.persen} % )
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(product.status)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const path = role === 'SALES'
                        ? `/products/sales/${product.sku}`
                        : `/products/${product.sku}`;
                      navigate(path);
                    }}
                    className="p-2 text-[#C9F35B] hover:bg-[#C9F35B]/10 rounded-lg transition-colors"
                    title="Detail"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {role === 'SALES' && (
                    <>
                      <button
                        onClick={() => onGunakan && onGunakan(product)}
                        disabled={
                          product.status === 'Used' ||
                          product.status === 'USED' ||
                          product.status === 'EXPIRED' ||
                          product.status === 'Expired' ||
                          product.status === 'INACTIVE' ||
                          !product.isActive
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          product.status === 'Used' ||
                          product.status === 'USED' ||
                          product.status === 'EXPIRED' ||
                          product.status === 'Expired' ||
                          product.status === 'INACTIVE' ||
                          !product.isActive
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900'
                        }`}
                        title={
                          product.status === 'Used' || product.status === 'USED'
                            ? 'Product already used'
                            : (product.status === 'EXPIRED' || product.status === 'Expired' || product.status === 'INACTIVE' || !product.isActive)
                            ? 'Product expired or inactive'
                            : 'Use product'
                        }
                      >
                        Gunakan
                      </button>
                      <button
                        onClick={() => onCetak && onCetak(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cetak Sertifikat"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
