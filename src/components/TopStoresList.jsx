const TopStoresList = ({ stores = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-6 h-full">
      <h3 className="text-xl font-bold mb-6">Toko Terbaik!</h3>
      <div className="space-y-4">
        {stores.slice(0, 10).map((store, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#C9F35B] rounded text-sm font-bold">
              #{index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{store.name}</p>
              <p className="text-sm text-gray-500">{store.address || 'Jl. Trunojoyo, Jember, Jawa Timur'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStoresList;
