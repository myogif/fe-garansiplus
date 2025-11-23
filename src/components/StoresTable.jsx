import { Mail, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

const StoresTable = ({ stores, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No stores found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Store Code</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Address</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <span className="font-medium text-gray-900">{store.kode_toko}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-gray-900">{store.name}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{store.address}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  {store.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />
                      <span>{store.email}</span>
                    </div>
                  )}
                  {!store.phone && !store.email && (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                {store.isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <CheckCircle size={14} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    <XCircle size={14} />
                    Inactive
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoresTable;
