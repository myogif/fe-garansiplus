import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { getSupervisorById, updateSupervisor } from '../../api/supervisors';

const EditSupervisorModal = ({ open, onClose, supervisorId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch supervisor data when modal opens or supervisorId changes
  useEffect(() => {
    if (open && supervisorId) {
      fetchSupervisorData();
    }
  }, [open, supervisorId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({ name: '', phone: '' });
      setMessage({ type: '', text: '' });
    }
  }, [open]);

  const fetchSupervisorData = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const response = await getSupervisorById(supervisorId);
      
      if (response?.data?.success) {
        const { name, phone } = response.data.data;
        setFormData({
          name: name || '',
          phone: phone || '',
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: response?.data?.message || 'Gagal memuat data supervisor.' 
        });
      }
    } catch (error) {
      console.error('Failed to fetch supervisor:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Gagal memuat data supervisor. Silakan coba lagi.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear message on input change
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Nama dan nomor HP harus diisi' });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    };

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      const response = await updateSupervisor(supervisorId, payload);

      if (response?.data?.success) {
        setMessage({ 
          type: 'success', 
          text: response.data.message || 'Supervisor berhasil diperbarui!' 
        });

        setTimeout(() => {
          setFormData({ name: '', phone: '' });
          setMessage({ type: '', text: '' });
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        let errorText = 'Gagal memperbarui supervisor. Silakan coba lagi.';

        if (response?.data?.errors && Array.isArray(response.data.errors) && response.data.errors.length > 0) {
          errorText = response.data.errors.join(', ');
        } else if (response?.data?.message) {
          errorText = response.data.message;
        }

        setMessage({
          type: 'error',
          text: errorText
        });
      }
    } catch (error) {
      console.error('Failed to update supervisor:', error);

      let errorText = 'Gagal memperbarui supervisor. Silakan coba lagi.';

      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorText = errorData.errors.join(', ');
        } else if (errorData.message) {
          errorText = errorData.message;
        }
      } else if (error?.message) {
        errorText = error.message;
      }

      setMessage({
        type: 'error',
        text: errorText
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({ name: '', phone: '' });
      setMessage({ type: '', text: '' });
      onClose();
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white shadow-xl transition-all">
                <div className="bg-[#C9F35B] hover:bg-[#B8E047] px-6 py-4">
                  <Dialog.Title className="text-xl font-semibold text-black">
                    Edit Supervisor
                  </Dialog.Title>
                </div>

                {loading ? (
                  <div className="p-12 flex flex-col items-center justify-center">
                    <svg className="animate-spin h-10 w-10 text-[#C9F35B] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Memuat data supervisor...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Message Alert */}
                    {message.text && (
                      <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                        message.type === 'success' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {message.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            message.type === 'success' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {message.text}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMessage({ type: '', text: '' })}
                          className={`flex-shrink-0 ${
                            message.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Masukkan nama supervisor"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor HP <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Masukkan nomor HP"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 text-sm font-medium text-gray-900 bg-[#C9F35B] rounded-xl hover:bg-[#B8E047] transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                          </>
                        ) : (
                          'Simpan'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditSupervisorModal;
