const StatCard = ({ title, value }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-lg">
      <h3 className="text-gray-300 text-xs font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
