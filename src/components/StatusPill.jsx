const StatusPill = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Expired':
        return 'bg-orange-100 text-orange-700';
      case 'Used':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
