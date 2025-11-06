const StatCard = ({ title, value }) => {
  return (
    <div className="bg-[#2B2B2B] rounded-2xl p-6">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-white text-4xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
