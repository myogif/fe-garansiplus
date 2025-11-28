import { Trash2 } from 'lucide-react';

const SupervisorsTable = ({ people, loading, role, onDelete }) => {
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
        <p className="text-gray-500">
          No {role === 'MANAGER' ? 'supervisors' : 'sales users'} found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
              Created At
            </th>
            <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
              Action
            </th>
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
                {new Date(person.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="py-4 px-4 text-center">
                {role !== 'SERVICE_CENTER' && (
                  <button
                    onClick={() => onDelete && onDelete(person)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupervisorsTable;
