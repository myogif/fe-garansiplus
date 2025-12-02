import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WARRANTY_OPTIONS = [
  { label: '3% - 6 months', value: 3, months: 6 },
  { label: '5% - 12 months', value: 5, months: 12 },
  { label: '10% - 24 months', value: 10, months: 24 },
  { label: 'Custom', value: 'custom' }
];

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
    invoice_number: '',
  });

  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [priceWarranty, setPriceWarranty] = useState('');
  const [isCustomPlan, setIsCustomPlan] = useState(false);

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
        invoice_number: product.invoice_number || '',
      });
      setWarrantyMonths(product.warranty_months || '');
      setPriceWarranty(product.price_warranty || '');

      const isPredefined = WARRANTY_OPTIONS.some(opt => opt.value === product.persen && opt.value !== 'custom');
      setIsCustomPlan(!isPredefined);
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
        invoice_number: '',
      });
      setWarrantyMonths('');
      setPriceWarranty('');
      setIsCustomPlan(false);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (!isCustomPlan && formData.price && formData.persen) {
      const pw = (Number(formData.price) * Number(formData.persen)) / 100;
      setPriceWarranty(pw);
    }
  }, [formData.price, formData.persen, isCustomPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarrantyPlanChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setIsCustomPlan(true);
      setFormData((prev) => ({ ...prev, persen: '' }));
      setWarrantyMonths('');
      setPriceWarranty('');
    } else {
      setIsCustomPlan(false);
      const selectedOption = WARRANTY_OPTIONS.find(opt => opt.value === Number(selectedValue));
      if (selectedOption) {
        setFormData((prev) => ({ ...prev, persen: selectedOption.value }));
        setWarrantyMonths(selectedOption.months);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      invoice_number: formData.invoice_number,
      warranty_months: Number(warrantyMonths),
      price_warranty: Number(priceWarranty)
    };

    onSave(payload);
    closeModal();
  };

  const isFormValid = () => {
    const baseValid = formData.name && formData.code && formData.tipe &&
                      formData.price && formData.invoice_number &&
                      formData.customer_name && formData.customer_phone &&
                      formData.customer_email;

    if (!baseValid) return false;

    if (isCustomPlan) {
      return formData.persen && !isNaN(formData.persen) &&
             warrantyMonths && !isNaN(warrantyMonths) && Number(warrantyMonths) > 0 &&
             priceWarranty && !isNaN(priceWarranty);
    } else {
      return formData.persen && warrantyMonths && !isNaN(priceWarranty);
    }
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                          placeholder="e.g., APPLE-I123PM-001"
                        />
                      </div>

                      <div>
                        <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Number / Nomor Nota <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="invoice_number"
                          id="invoice_number"
                          required
                          value={formData.invoice_number}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                          placeholder="e.g., INV-2025-001"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                          placeholder="Enter price"
                        />
                      </div>

                      <div>
                        <label htmlFor="warranty_plan" className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty Plan <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="warranty_plan"
                          name="warranty_plan"
                          required
                          value={isCustomPlan ? 'custom' : formData.persen}
                          onChange={handleWarrantyPlanChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                        >
                          <option value="">Select warranty plan</option>
                          {WARRANTY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {isCustomPlan && (
                        <>
                          <div>
                            <label htmlFor="custom_persen" className="block text-sm font-medium text-gray-700 mb-2">
                              Custom Percentage (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="persen"
                              id="custom_persen"
                              required
                              min="0"
                              step="0.01"
                              value={formData.persen}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                              placeholder="e.g., 7.5"
                            />
                          </div>

                          <div>
                            <label htmlFor="custom_months" className="block text-sm font-medium text-gray-700 mb-2">
                              Custom Warranty Months <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="warranty_months"
                              id="custom_months"
                              required
                              min="1"
                              step="1"
                              value={warrantyMonths}
                              onChange={(e) => setWarrantyMonths(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
                              placeholder="e.g., 18"
                            />
                          </div>
                        </>
                      )}

                      {!isCustomPlan && warrantyMonths && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty Duration
                          </label>
                          <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                            {warrantyMonths} months
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="price_warranty" className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty Price / Biaya Garansi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price_warranty"
                          id="price_warranty"
                          required
                          min="0"
                          step="0.01"
                          value={priceWarranty}
                          onChange={(e) => {
                            if (isCustomPlan) {
                              setPriceWarranty(e.target.value);
                            }
                          }}
                          readOnly={!isCustomPlan}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent ${
                            !isCustomPlan ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300'
                          }`}
                          placeholder="Auto-calculated or enter custom amount"
                        />
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent"
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
                      disabled={!isFormValid()}
                      className="px-6 py-2.5 bg-[#C9F35B] hover:bg-[#B8E047] text-gray-900 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#C9F35B]"
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
