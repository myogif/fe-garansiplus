import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchCustomers, downloadCertificate } from '../../api/customers';
import CustomersTable from '../../components/CustomersTable';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';
import Toast from '../../components/Toast';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { items, pagination: pg } = await fetchCustomers({
        page,
        search: debouncedSearchTerm,
      });
      setCustomers(items);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setToast({
        show: true,
        message: 'Gagal memuat data customer',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page, debouncedSearchTerm]);

  const handleDownloadCertificate = async (warrantyId) => {
    try {
      const response = await downloadCertificate(warrantyId);
      const data = response?.data || response;

      if (data?.success === true || data?.status === true) {
        const message = data.message || 'Sertifikat berhasil diunduh';
        setToast({
          show: true,
          message: message,
          type: 'success',
        });
      } else {
        let errorText = 'Gagal mengunduh sertifikat';
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorText = data.errors.join(', ');
        } else if (data?.message) {
          errorText = data.message;
        }
        setToast({
          show: true,
          message: errorText,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to download certificate:', error);

      let errorText = 'Gagal mengunduh sertifikat';
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorText = errorData.errors.join(', ');
        } else if (errorData.message) {
          errorText = errorData.message;
        }
      } else if (error?.message) {
        errorText = error.message;
      }

      setToast({
        show: true,
        message: errorText,
        type: 'error',
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Customer</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari customer..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CustomersTable
          customers={customers}
          loading={loading}
          onDownloadCertificate={handleDownloadCertificate}
        />

        {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </MainLayout>
  );
};

export default CustomersList;
