import { useEffect, useState } from 'react';
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

  const handleSave = async (formData) => {
    try {
      if (role === 'MANAGER') {
        await createSupervisor(formData);
      } else {
        await createSalesUser(formData);
      }
      loadPeople();
    } catch (error) {
      console.error('Failed to save person:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (role === 'MANAGER') {
        await deleteSupervisor(selectedPerson.id);
      } else {
        await deleteSalesUser(selectedPerson.id);
      }
      loadPeople();
    } catch (error) {
      console.error('Failed to delete person:', error);
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                {role === 'MANAGER' ? 'Add Supervisor' : 'Add Sales'}
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari..."
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
    </MainLayout>
  );
};

export default SupervisorsList;
