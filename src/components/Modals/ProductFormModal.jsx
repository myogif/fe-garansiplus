import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductFormModal = ({ isOpen, closeModal, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    notes: '',
    persen: '',
    isActive: true,
    tipe: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        code: product.code || product.sku || '',
        price: product.price || '',
        notes: product.notes || product.description || '',
        persen: product.persen || '',
        isActive: product.isActive ?? true,
        tipe: product.tipe || product.type || '',
        customer_name: product.customer_name || '',
        customer_phone: product.customer_phone || '',
        customer_email: product.customer_email || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        price: '',
        notes: '',
        persen: '',
        isActive: true,
        tipe: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-900"
                  >
                    {product ? 'Edit Product' : 'Add Product'}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                          Product Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="code"
                          id="code"
                          required
                          value={formData.code}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., APPLE-I123PM-001"
                        />
                      </div>

                      <div>
                        <label htmlFor="tipe" className="block text-sm font-medium text-gray-700 mb-2">
                          Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tipe"
                          id="tipe"
                          required
                          value={formData.tipe}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., SMARTPHONE"
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          required
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter price"
                        />
                      </div>

                      <div>
                        <label htmlFor="persen" className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="persen"
                          name="persen"
                          required
                          value={formData.persen === 3 ? '3' : formData.persen === 6 ? '5' : ''}
                          onChange={(e) => {
                            const selectedLabel = e.target.value;
                            const persenValue = selectedLabel === '3' ? 3 : 6;
                            setFormData(prev => ({ ...prev, persen: persenValue }));
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select percentage</option>
                          <option value="3">3</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customer_name"
                          id="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter customer name"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customer_phone"
                          id="customer_phone"
                          required
                          value={formData.customer_phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 081233344455"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="customer_email"
                          id="customer_email"
                          required
                          value={formData.customer_email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="customer@example.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          id="notes"
                          rows="3"
                          value={formData.notes}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Additional notes about the product"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                      {product ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductFormModal;
