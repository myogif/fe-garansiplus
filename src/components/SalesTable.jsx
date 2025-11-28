import { Trash2, MoreVertical } from 'lucide-react';
import { Menu } from '@headlessui/react';

const SalesTable = ({ people, loading, role, onDelete }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-12 bg-gray-200 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-500">No sales users found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Email/Phone
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Store
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Supervisor
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              {role === 'SUPERVISOR' && (
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {people.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-900">
                  {person.name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {person.phone}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {person.store?.name || '-'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {person.supervisor?.name || '-'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {new Date(person.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                {role === 'SUPERVISOR' && (
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onDelete && onDelete(person)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            {role === 'SUPERVISOR' && (
              <button
                onClick={() => onDelete && onDelete(person)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors z-20"
                aria-label="Delete"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            )}

            <div className="space-y-3 pr-12">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm font-medium text-gray-900">{person.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email/Phone</p>
                <p className="text-sm text-gray-700">{person.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Store</p>
                  <p className="text-sm text-gray-700">{person.store?.name || '-'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Supervisor</p>
                  <p className="text-sm text-gray-700">{person.supervisor?.name || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-sm text-gray-700">
                  {new Date(person.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SalesTable;
