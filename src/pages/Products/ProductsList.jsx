import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductByCode, exportManagerProductsToExcel } from '../../api/products';
import { updateSalesProduct, deleteSalesProduct, exportSalesProductsToExcel, fetchSalesProductDetail, useProduct, downloadProductCertificate } from '../../api/sales';
import { exportSupervisorProductsToExcel } from '../../api/supervisors';
import ProductsTable from '../../components/ProductsTable';
import ProductFormModal from '../../components/Modals/ProductFormModal';
import ConfirmDelete from '../../components/Modals/ConfirmDelete';
import ExportExcelModal from '../../components/Modals/ExportExcelModal';
import ConfirmUseProduct from '../../components/Modals/ConfirmUseProduct';
import Toast from '../../components/Toast';
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConfirmUseOpen, setIsConfirmUseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
      const productDetails = role === 'SALES'
        ? await fetchSalesProductDetail(product.sku)
        : await fetchProductByCode(role, product.sku);

      setSelectedProduct(productDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      showToast('Failed to load product details', 'error');
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
        const payload = {
          name: formData.name,
          tipe: formData.tipe,
          code: formData.code,
          price: Number(formData.price),
          persen: Number(formData.persen),
          notes: formData.notes,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
        };
        await createProduct(payload);
      }
      setIsModalOpen(false);
      loadProducts();
      showToast('Product saved successfully');
    } catch (error) {
      console.error('Failed to save product:', error);
      showToast('Failed to save product. Please try again.', 'error');
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
      if (role === 'MANAGER') {
        await exportManagerProductsToExcel({
          code: '',
          created_at_from: dateFilter.start_date,
          created_at_to: dateFilter.end_date,
        });
      } else if (role === 'SUPERVISOR') {
        await exportSupervisorProductsToExcel({
          code: '',
          created_at_from: dateFilter.start_date,
          created_at_to: dateFilter.end_date,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export data', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleGunakan = (product) => {
    setSelectedProduct(product);
    setIsConfirmUseOpen(true);
  };

  const handleConfirmUse = async () => {
    try {
      await useProduct(selectedProduct.id);
      loadProducts();
      showToast('Product has been marked as used successfully');
    } catch (error) {
      console.error('Failed to use product:', error);
      showToast('Failed to use product. Please try again.', 'error');
    }
  };

  const handleCetak = async (product) => {
    try {
      await downloadProductCertificate(product.id);
      showToast('Sertifikat berhasil diunduh');
    } catch (error) {
      console.error('Failed to download certificate:', error);
      showToast('Gagal mengunduh sertifikat', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
            <div className="flex items-center gap-3">
              {role === 'SALES' && (
                <button
                  onClick={handleCreate}
                  className="bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Add Product
                </button>
              )}
              {(role === 'SALES' || role === 'MANAGER' || role === 'SUPERVISOR') && role !== 'SERVICE_CENTER' && (
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
                >
                  <Download size={18} />
                  Export Excel
                </button>
              )}
            </div>
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
          onGunakan={handleGunakan}
          onCetak={handleCetak}
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

      <ConfirmUseProduct
        isOpen={isConfirmUseOpen}
        closeModal={() => setIsConfirmUseOpen(false)}
        onConfirm={handleConfirmUse}
        product={selectedProduct}
      />

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </MainLayout>
  );
};

export default ProductsList;
