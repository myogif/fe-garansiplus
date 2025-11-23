import { Info, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';

const ProductsTable = ({ products, loading, role, onEdit, onDelete }) => {
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

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Aktif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Expired
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
                {getStatusBadge(product.isActive)}
              </td>
              <td className="py-4 px-4 text-center">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <MoreVertical size={16} className="text-gray-600" />
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate(`/products/${product.sku}`)}
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors`}
                          >
                            <Info className="w-4 h-4 text-gray-500" />
                            Detail
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onEdit && onEdit(product)}
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors`}
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onDelete && onDelete(product)}
                            className={`${
                              active ? 'bg-red-50' : ''
                            } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 transition-colors`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
