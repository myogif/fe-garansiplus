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
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <MoreVertical size={16} className="text-gray-600" />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="p-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => onDelete && onDelete(person)}
                              className={`${
                                active ? 'bg-red-50' : ''
                              } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 transition-colors`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
