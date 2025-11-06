const SupervisorsTable = ({ people, loading, role, onDelete }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No {role === 'MANAGER' ? 'supervisors' : 'sales users'} found.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
          {role === 'MANAGER' ? 'Add Supervisor' : 'Create Sales User'}
        </button>
      </div>
    );
  }

  const columns =
    role === 'MANAGER'
      ? ['Name', 'Email/Phone', 'Store', 'Created At', 'Actions']
      : ['Name', 'Email/Phone', 'Store', 'Created At', 'Actions'];

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className="py-2 px-4 border-b">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {people.map((person) => (
          <tr key={person.id}>
            <td className="py-2 px-4 border-b">{person.name}</td>
            <td className="py-2 px-4 border-b">{person.phone}</td>
            <td className="py-2 px-4 border-b">{person.store?.name}</td>
            <td className="py-2 px-4 border-b">
              {new Date(person.createdAt).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border-b">
              <button
                className="text-red-500"
                onClick={() => onDelete(person)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SupervisorsTable;
