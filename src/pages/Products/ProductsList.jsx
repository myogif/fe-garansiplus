import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { updateSalesProduct, deleteSalesProduct, exportSalesProductsToExcel, fetchSalesProductById } from '../../api/sales';
import ProductsTable from '../../components/ProductsTable';
import ProductFormModal from '../../components/Modals/ProductFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import ExportExcelModal from '../../components/Modals/ExportExcelModal';
import Pagination from '../../components/Pagination';
import useDebounce from '../../hooks/useDebounce';
import MainLayout from '../../components/MainLayout';
import client from '../../api/client';

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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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

  const handleEdit = async (product) => {
    try {
      setLoading(true);
      let productDetails;

      if (role === 'SALES') {
        productDetails = await fetchSalesProductById(product.id);
      } else {
        const res = await client.get(`/api/${role.toLowerCase()}/products/${product.id}`);
        const data = res.data?.data || {};
        productDetails = {
          id: data.id,
          name: data.name,
          sku: data.code,
          code: data.code,
          type: data.tipe,
          price: data.price,
          priceWarranty: data.priceWarranty,
          persen: data.persen,
          status: data.status,
          description: data.notes,
          notes: data.notes,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_email: data.customer_email,
          isActive: data.isActive,
        };
      }

      setSelectedProduct(productDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProduct) {
        if (role === 'SALES') {
          await updateSalesProduct(selectedProduct.id, formData);
        } else {
          await updateProduct(selectedProduct.id, formData);
        }
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
      if (role === 'SALES') {
        await deleteSalesProduct(selectedProduct.id);
      } else {
        await deleteProduct(selectedProduct.id, role);
      }
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleExport = async (dateFilter) => {
    try {
      await exportSalesProductsToExcel({
        code: '',
        created_at_from: dateFilter.start_date,
        created_at_to: dateFilter.end_date,
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
            {role === 'SALES' && (
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
              >
                <Download size={18} />
                Export Excel
              </button>
            )}
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

      <ExportExcelModal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </MainLayout>
  );
};

export default ProductsList;
