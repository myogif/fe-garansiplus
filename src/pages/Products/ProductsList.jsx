import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import ProductsTable from '../../components/ProductsTable';
import ProductFormModal from '../../components/Modals/ProductFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
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

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        {role === 'SALES' && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleCreate}
          >
            Create Product
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or SKU"
          className="border rounded-lg px-4 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {role === 'SALES' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="mine"
              checked={mine}
              onChange={() => setMine(!mine)}
              className="mr-2"
            />
            <label htmlFor="mine">Show only my products</label>
          </div>
        )}
        <button
          className="border rounded-lg px-4 py-2"
          onClick={loadProducts}
        >
          Refresh
        </button>
      </div>

      <ProductsTable
        products={products}
        loading={loading}
        role={role}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
