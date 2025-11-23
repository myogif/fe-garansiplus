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

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const { items, pagination: pg } = await listSalesUsers(role, {
        page,
        search: debouncedSearchTerm,
      });
      console.log('Loaded Sales People:', items);
      console.log('Pagination:', pg);
      setPeople(items);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch sales users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [role, page, debouncedSearchTerm]);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (person) => {
    setSelectedPerson(person);
    setIsConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      await createSalesUser(formData);
      loadPeople();
    } catch (error) {
      console.error('Failed to save sales user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSalesUser(selectedPerson.id);
      loadPeople();
    } catch (error) {
      console.error('Failed to delete sales user:', error);
    }
  };

  console.log('SalesList render - role:', role, 'people:', people, 'loading:', loading);

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Sales</h1>
            {role === 'SUPERVISOR' && (
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Add Sales
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
    </MainLayout>
  );
};

export default SalesList;
