import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import { fetchSalesProductDetail, exportSalesProductsToExcel } from '../../api/sales';
import ExportExcelModal from '../../components/Modals/ExportExcelModal';

const SalesProductDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [code]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSalesProductDetail(code);
      setProduct(data);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (dateFilter) => {
    try {
      await exportSalesProductsToExcel({
        code: code,
        created_at_from: dateFilter.start_date,
        created_at_to: dateFilter.end_date,
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3 mt-8">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/products')}
              className="text-[#C9F35B] hover:text-[#B8E047] font-medium"
            >
              Back to Products
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-center text-gray-500">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'Aktif'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.status}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#C9F35B]/20 text-gray-900">
                {product.type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>

              <div>
                <label className="text-sm font-medium text-gray-500">Product Code</label>
                <p className="text-gray-900 font-medium">{product.code}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Membership Number</label>
                <p className="text-gray-900 font-medium">{product.membership_number || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Product Price</label>
                <p className="text-gray-900 font-medium">{formatCurrency(product.price)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Warranty Price</label>
                <p className="text-gray-900 font-medium">{formatCurrency(product.priceWarranty)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Warranty Percentage</label>
                <p className="text-gray-900 font-medium">{product.persen}%</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{product.notes || '-'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>

              <div>
                <label className="text-sm font-medium text-gray-500">Customer Name</label>
                <p className="text-gray-900 font-medium">{product.customer_name || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-gray-900 font-medium">{product.customer_phone || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 font-medium">{product.customer_email || '-'}</p>
              </div>

              {product.store && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Store Information</h2>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Store Name</label>
                    <p className="text-gray-900 font-medium">{product.store.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Store Code</label>
                    <p className="text-gray-900 font-medium">{product.store.kode_toko}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{product.store.address}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <p className="text-gray-900">{product.store.phone}</p>
                    <p className="text-gray-900 text-sm">{product.store.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {product.creator && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Creator Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Creator Name</label>
                  <p className="text-gray-900 font-medium">{product.creator.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 font-medium">{product.creator.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">{product.creator.phone}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{formatDate(product.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{formatDate(product.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExportExcelModal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </MainLayout>
  );
};

export default SalesProductDetail;
