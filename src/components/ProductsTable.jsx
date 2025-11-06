import StatusPill from './StatusPill';

const ProductsTable = ({ products, loading, role, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found.</p>
        {role === 'SALES' && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
            Create Product
          </button>
        )}
      </div>
    );
  }

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">SKU</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Created At</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="py-2 px-4 border-b">{product.name}</td>
            <td className="py-2 px-4 border-b">{product.sku}</td>
            <td className="py-2 px-4 border-b">{product.price}</td>
            <td className="py-2 px-4 border-b">
              <StatusPill status={product.status} />
            </td>
            <td className="py-2 px-4 border-b">
              {new Date(product.created_at).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border-b">
              {role === 'SUPERVISOR' && (
                <button
                  className="text-red-500"
                  onClick={() => onDelete(product)}
                >
                  Delete
                </button>
              )}
              {role === 'SALES' && (
                <>
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
