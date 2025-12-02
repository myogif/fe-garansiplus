import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listSalesUsers, createSalesUser, deleteSalesUser } from '../../api/supervisors';
import SalesTable from '../../components/SalesTable';
import SalesFormModal from '../../components/Modals/SalesFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';
import Toast from '../../components/Toast';

const SalesList = () => {
  const { role } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const { items, pagination: pg } = await listSalesUsers(role, {
        page,
        search: debouncedSearchTerm,
      });
      setPeople(items || []);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch sales users:', error);
      setError(error.message || 'Failed to load sales users');
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      loadPeople();
    }
  }, [role, page, debouncedSearchTerm]);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (person) => {
    setSelectedPerson(person);
    setIsConfirmOpen(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const handleSave = async (formData) => {
    try {
      const response = await createSalesUser(formData);
      const data = response?.data || response;

      if (data?.success === true || data?.status === true) {
        const message = data.message || 'Sales user created successfully';
        showToast(message, 'success');
        loadPeople();
        return data;
      } else {
        let errorText = 'Failed to create sales user';
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorText = data.errors.join(', ');
        } else if (data?.message) {
          errorText = data.message;
        }
        showToast(errorText, 'error');
        return data;
      }
    } catch (error) {
      console.error('Failed to save sales user:', error);

      let errorText = 'Failed to save sales user';
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

      showToast(errorText, 'error');
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteSalesUser(selectedPerson.id);
      const data = response?.data || response;

      if (data?.success === true || data?.status === true) {
        const message = data.message || 'Sales user deleted successfully';
        showToast(message, 'success');
        loadPeople();
      } else {
        let errorText = 'Failed to delete sales user';
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorText = data.errors.join(', ');
        } else if (data?.message) {
          errorText = data.message;
        }
        showToast(errorText, 'error');
      }
    } catch (error) {
      console.error('Failed to delete sales user:', error);

      let errorText = 'Failed to delete sales user';
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

      showToast(errorText, 'error');
    }
  };

  if (!role) {
    return (
      <MainLayout>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p>Loading role...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sales List</h1>
            {role === 'SUPERVISOR' && (
              <button
                onClick={handleCreate}
                className="bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Add Sales
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search sales..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <SalesTable
          people={people}
          loading={loading}
          role={role}
          onDelete={handleDelete}
        />

        {pagination && !loading && <Pagination pagination={pagination} onPageChange={setPage} />}
      </div>

      {role === 'SUPERVISOR' && (
        <>
          <SalesFormModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            onSave={handleSave}
          />

          <ConfirmDelete
            isOpen={isConfirmOpen}
            closeModal={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Sales User"
            message="Are you sure you want to delete this sales user?"
          />
        </>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </MainLayout>
  );
};

export default SalesList;
