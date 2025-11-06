import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProductsTable from '../components/ProductsTable';
import { useAuth } from '../context/AuthContext';
import { getProducts as getManagerProducts } from '../services/managers';
import { getProducts as getSupervisorProducts } from '../services/supervisors';

const Products = () => {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchProducts();
  }, [params]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      const queryParams = { ...params };

      if (role === 'MANAGER' && searchQuery) {
        queryParams.store_name = searchQuery;
      }

      if (role === 'MANAGER') {
        response = await getManagerProducts(queryParams);
      } else {
        response = await getSupervisorProducts(queryParams);
      }

      setProducts(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Daftar Produk
            </h1>

            {role === 'MANAGER' && (
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by store name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9F35B] hover:bg-[#BCEB4F] text-gray-900 font-medium rounded-lg transition-colors text-sm"
                >
                  Search
                </button>
              </form>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="text-gray-600">Loading products...</div>
            </div>
          ) : (
            <ProductsTable
              products={products}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
