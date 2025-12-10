import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import StatusPill from '../../components/StatusPill';
import { fetchSalesProductDetail } from '../../api/sales';

const SalesProductDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateWarrantyPeriod = (createdAt, warrantyMonths) => {
    if (!createdAt || !warrantyMonths) {
      return '-';
    }
    const dateString = createdAt.replace(' ', 'T');
    const startDate = new Date(dateString);
    
    if (isNaN(startDate.getTime())) return '-';
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(warrantyMonths, 10));

    const startStr = formatDate(createdAt);
    const endStr = formatDate(endDate.toISOString());

    return `${startStr} S/D ${endStr} ( ${warrantyMonths} Bulan )`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
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
              onClick={() => navigate(-1)}
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-center text-gray-500">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            {product.tipe && (
              <span className="px-4 py-1.5 bg-[#C9F35B] text-gray-900 rounded-lg text-xs font-bold uppercase tracking-wide">
                {product.tipe}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-600">Nomor Kepesertaan</span>
            <span className="font-semibold text-gray-900">
              {product.nomorKepesertaan || '-'}
            </span>
            <StatusPill status={product.status || (product.isActive ? 'Aktif' : 'Expired')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Nama</label>
            <p className="text-gray-900 font-medium">
              {product.customerName || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Nomor Telepon
            </label>
            <p className="text-gray-900 font-medium">
              {product.customerPhone || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Email</label>
            <p className="text-gray-900 font-medium">
              {product.customerEmail || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              No. Invoice
            </label>
            <p className="text-gray-900 font-medium">
              {product.invoiceNumber || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Tanggal Pembelian
            </label>
            <p className="text-gray-900 font-medium">
              {formatDate(product.createdAt)}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Kode Produk
            </label>
            <p className="text-gray-900 font-medium">{product.code || '-'}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Harga Produk
            </label>
            <p className="text-gray-900 font-medium">
              {formatPrice(product.price)}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Harga Garansi
            </label>
            <p className="text-gray-900 font-medium">
              {formatPrice(product.priceWarranty)}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Persentase Garansi
            </label>
            <p className="text-gray-900 font-medium">
              {product.persen}%
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Kode Toko
            </label>
            <p className="text-gray-900 font-medium">
              {product.store?.kode_toko || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Nama Toko
            </label>
            <p className="text-gray-900 font-medium">
              {product.store?.name || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Alamat Toko
            </label>
            <p className="text-gray-900 font-medium">
              {product.store?.address || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Telepon Toko
            </label>
            <p className="text-gray-900 font-medium">
              {product.store?.phone || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Sales</label>
            <p className="text-gray-900 font-medium">
              {product.creator?.name || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Total</label>
            <p className="text-gray-900 font-semibold text-lg">
              {formatPrice(Number(product.price || 0) + Number(product.priceWarranty || 0))}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Telepon Sales
            </label>
            <p className="text-gray-900 font-medium">
              {product.creator?.phone || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Periode Kepesertaan Garansi
            </label>
            <p className="text-gray-900 font-medium">
              {calculateWarrantyPeriod(product.createdAt, product.warrantyMonths)}
            </p>
          </div>

          {product.notes && (
            <div className="md:col-span-3">
              <label className="block text-sm text-gray-500 mb-2">
                Catatan
              </label>
              <p className="text-gray-900 font-medium">
                {product.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesProductDetail;
