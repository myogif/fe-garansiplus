import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchProductByCode } from '../../api/products';
import MainLayout from '../../components/MainLayout';
import StatusPill from '../../components/StatusPill';

const ProductDetail = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchProductByCode(role, id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id && role) {
      fetchProductDetail();
    }
  }, [id, role]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateWarrantyPeriod = (createdAt) => {
    if (!createdAt) return '-';
    const startDate = new Date(createdAt);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    return `${startStr} S/D ${endStr} ( 6 Bulan )`;
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
            {product.type && (
              <span className="px-4 py-1.5 bg-[#C9F35B] text-gray-900 rounded-lg text-xs font-bold uppercase tracking-wide">
                {product.type}
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
              Harga Garansi (%)
            </label>
            <p className="text-gray-900 font-medium">
              {formatPrice(product.priceWarranty)} ( {product.persen}% )
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
            <label className="block text-sm text-gray-500 mb-2">Sales</label>
            <p className="text-gray-900 font-medium">
              {product.creator?.name || '-'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Total</label>
            <p className="text-gray-900 font-semibold text-lg">
              {formatPrice(product.price + product.priceWarranty)}
            </p>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-gray-500 mb-2">
              Periode Kepesertaan Garansi
            </label>
            <p className="text-gray-900 font-medium">
              {calculateWarrantyPeriod(product.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
