import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStores, createStore, deleteStore } from '../../api/managers';
import StoresTable from '../../components/StoresTable';
import StoreFormModal from '../../components/Modals/StoreFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';
import Toast from '../../components/Toast';

const StoresList = () => {
  const { role } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadStores = async () => {
    try {
      setLoading(true);
      const { items, pagination: pg } = await getStores(page, 10, debouncedSearchTerm);
      setStores(items);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      showToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, [page, debouncedSearchTerm]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedStore(null);
  };

  const handleSave = async (formData) => {
    try {
      await createStore(formData);
      loadStores();
      showToast('Store created successfully');
    } catch (error) {
      console.error('Failed to create store:', error);
      showToast('Failed to create store', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteStore(selectedStore.id);
      const message = response?.data?.message || 'Store deleted successfully';
      loadStores();
      showToast(message);
    } catch (error) {
      console.error('Failed to delete store:', error);
      const message = error?.response?.data?.message || 'Failed to delete store';
      showToast(message, 'error');
    } finally {
      setSelectedStore(null);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Toko</h1>
            {role === 'MANAGER' && (
              <button
                onClick={handleCreate}
                className="bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Add Store
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search stores..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <StoresTable stores={stores} loading={loading} role={role} onDelete={handleDelete} />

        {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
      </div>

      <StoreFormModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDelete
        isOpen={isConfirmOpen}
        closeModal={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Store"
        message={`Are you sure you want to delete ${selectedStore?.name || 'this store'}?`}
      />

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </MainLayout>
  );
};

export default StoresList;
