import { useEffect, useState } from 'react';
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {role === 'MANAGER' ? 'Supervisors' : 'Sales Users'}
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleCreate}
        >
          {role === 'MANAGER' ? 'Add Supervisor' : 'Create Sales User'}
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email/phone"
          className="border rounded-lg px-4 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="border rounded-lg px-4 py-2"
          onClick={loadPeople}
        >
          Refresh
        </button>
      </div>

      <SupervisorsTable
        people={people}
        loading={loading}
        role={role}
        onDelete={handleDelete}
      />

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
