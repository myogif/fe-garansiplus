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
import EditSupervisorModal from '../../components/Modals/EditSupervisorModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsEditModalOpen(true);
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
          showToast(data.message || 'Supervisor berhasil dibuat', 'success');
          loadPeople();
          return data;
        } else {
          let errorText = 'Gagal membuat supervisor';
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
          showToast(data.message || 'Pengguna sales berhasil dibuat', 'success');
          loadPeople();
          return data;
        } else {
          let errorText = 'Gagal membuat pengguna sales';
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

      let errorText = 'Gagal menyimpan. Silakan coba lagi.';
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
        const message = data.message || `${role === 'MANAGER' ? 'Supervisor' : 'Pengguna sales'} berhasil dihapus`;
        showToast(message, 'success');
        loadPeople();
      } else {
        let errorText = `Gagal menghapus ${role === 'MANAGER' ? 'supervisor' : 'pengguna sales'}`;
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
              {role === 'MANAGER' || role === 'SERVICE_CENTER' ? 'Daftar Supervisor' : 'Daftar Sales'}
            </h1>
            {role !== 'SERVICE_CENTER' && (
              <button
                onClick={handleCreate}
                className="bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                {role === 'MANAGER' ? 'Tambah Supervisor' : 'Tambah Sales'}
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari supervisor..."
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
      </div>

      <SupervisorFormModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <EditSupervisorModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supervisorId={selectedPerson?.id}
        onSuccess={loadPeople}
      />

      <ConfirmDelete
        isOpen={isConfirmOpen}
        closeModal={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Hapus ${role === 'MANAGER' ? 'Supervisor' : 'Pengguna Sales'}`}
        message={`Apakah Anda yakin ingin menghapus ${
          role === 'MANAGER' ? 'supervisor' : 'pengguna sales'
        } ini?`}
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
