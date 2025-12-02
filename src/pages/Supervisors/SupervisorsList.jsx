import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listRolePeople,
  createSupervisor,
  deleteSupervisor,
  createSalesUser,
  deleteSalesUser,
} from '../../api/supervisors';
import SupervisorsTable from '../../components/SupervisorsTable';
import SupervisorFormModal from '../../components/Modals/SupervisorFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';
import Toast from '../../components/Toast';

const SupervisorsList = () => {
  const { role, token } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const { items, pagination: pg } = await listRolePeople(role, {
        token,
        page,
        search: debouncedSearchTerm,
      });
      setPeople(items);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [role, token, page, debouncedSearchTerm]);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (person) => {
    setSelectedPerson(person);
    setIsConfirmOpen(true);
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const handleSave = async (formData) => {
    try {
      if (role === 'MANAGER') {
        const response = await createSupervisor(formData);
        const data = response.data;

        if (data?.success === true) {
          showToast(data.message || 'Supervisor created successfully', 'success');
          loadPeople();
          return data;
        } else {
          let errorText = 'Failed to create supervisor';
          if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            errorText = data.errors.join(', ');
          } else if (data?.message) {
            errorText = data.message;
          }
          showToast(errorText, 'error');
          return data;
        }
      } else {
        const response = await createSalesUser(formData);
        const data = response.data;

        if (data?.success === true) {
          showToast(data.message || 'Sales user created successfully', 'success');
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
      }
    } catch (error) {
      console.error('Failed to save person:', error);

      let errorText = 'Failed to save. Please try again.';
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
      let response;
      if (role === 'MANAGER') {
        response = await deleteSupervisor(selectedPerson.id);
      } else {
        response = await deleteSalesUser(selectedPerson.id);
      }

      const data = response?.data || response;

      if (data?.success === true || data?.status === true) {
        const message = data.message || `${role === 'MANAGER' ? 'Supervisor' : 'Sales user'} deleted successfully`;
        showToast(message, 'success');
        loadPeople();
      } else {
        let errorText = `Failed to delete ${role === 'MANAGER' ? 'supervisor' : 'sales user'}`;
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorText = data.errors.join(', ');
        } else if (data?.message) {
          errorText = data.message;
        }
        showToast(errorText, 'error');
      }
    } catch (error) {
      console.error('Failed to delete person:', error);

      let errorText = `Failed to delete ${role === 'MANAGER' ? 'supervisor' : 'sales user'}`;
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

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {role === 'MANAGER' || role === 'SERVICE_CENTER' ? 'Supervisor List' : 'Sales List'}
            </h1>
            {role !== 'SERVICE_CENTER' && (
              <button
                onClick={handleCreate}
                className="bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                {role === 'MANAGER' ? 'Add Supervisor' : 'Add Sales'}
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search supervisors..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <SupervisorsTable
          people={people}
          loading={loading}
          role={role}
          onDelete={handleDelete}
        />

        {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
      </div>

      <SupervisorFormModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDelete
        isOpen={isConfirmOpen}
        closeModal={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${role === 'MANAGER' ? 'Supervisor' : 'Sales User'}`}
        message={`Are you sure you want to delete this ${
          role === 'MANAGER' ? 'supervisor' : 'sales user'
        }?`}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </MainLayout>
  );
};

export default SupervisorsList;
