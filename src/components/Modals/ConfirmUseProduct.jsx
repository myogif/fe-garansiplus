import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmUseProduct = ({ isOpen, closeModal, onConfirm, product }) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Confirm Use Product
                      </Dialog.Title>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to use this product? The product will be marked as used.
                    </p>
                    {product && (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Product Name:</span>
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Code:</span>
                          <span className="text-sm font-medium text-gray-900">{product.sku || product.code}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-[#C9F35B] rounded-xl hover:bg-[#B8E047] transition-colors shadow-sm hover:shadow-md"
                    >
                      Yes, Use It
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmUseProduct;
