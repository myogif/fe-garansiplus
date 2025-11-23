const StatusPill = ({ status }) => {
  const statusClasses = {
    ACTIVE: 'bg-green-100 text-green-800',
    Aktif: 'bg-green-100 text-green-800',
    USED: 'bg-yellow-100 text-yellow-800',
    Used: 'bg-yellow-100 text-yellow-800',
    INACTIVE: 'bg-red-100 text-red-800',
    Expired: 'bg-red-100 text-red-800',
  };

  const classes = statusClasses[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
