import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import ProductsTable from '../../components/ProductsTable';
import ProductFormModal from '../../components/Modals/ProductFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';

const ProductsList = () => {
  const { role, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mine, setMine] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { items, pagination: pg } = await fetchProducts(role, {
        token,
        mine: role === 'SALES' ? mine : undefined,
        page,
        search: debouncedSearchTerm,
      });
      setProducts(items);
      setPagination(pg);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [role, token, mine, page, debouncedSearchTerm]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id, role);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ProductsTable
          products={products}
          loading={loading}
          role={role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSave}
      />

      <ConfirmDelete
        isOpen={isConfirmOpen}
        closeModal={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </MainLayout>
  );
};

export default ProductsList;
