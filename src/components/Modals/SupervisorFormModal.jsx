import { Dialog, Transition, Combobox } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Check, ChevronDown, X, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchStores } from '../../api/managers';

const SupervisorFormModal = ({ isOpen, closeModal, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    store_id: '',
  });
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      loadStores();
      // Clear message when modal opens
      setMessage({ type: '', text: '' });
    }
  }, [isOpen]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await fetchStores();
      
      // fetchStores() return res.data, jadi data bisa berupa response object atau array langsung
      if (data && data.success === false) {
        // Jika response gagal
        setMessage({ type: 'error', text: data.message || 'Gagal memuat toko.' });
        setStores([]);
      } else {
        // Jika sukses, data bisa berupa array atau object dengan property data
        setStores(data.data || data);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      // Error dari axios, response ada di error.response.data
      const errorMessage = error?.response?.data?.message || error?.message || 'Gagal memuat toko. Silakan coba lagi.';
      setMessage({ type: 'error', text: errorMessage });
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores =
    query === ''
      ? stores
      : stores.filter((store) =>
          store.name.toLowerCase().includes(query.toLowerCase()) ||
          store.kode_toko.toLowerCase().includes(query.toLowerCase())
        );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear message on input change
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setFormData((prev) => ({ ...prev, store_id: store?.id || '' }));
    // Clear message on selection change
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStore) {
      setMessage({ type: 'error', text: 'Silakan pilih toko' });
      return;
    }

    const payload = {
      phone: formData.phone,
      password: formData.password,
      name: formData.name,
      storeId: selectedStore.id
    };

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      const response = await onSave(payload);

      if (response && response.success === true) {
        setMessage({ type: 'success', text: response.message || 'Supervisor berhasil dibuat!' });

        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            password: '',
            store_id: '',
          });
          setSelectedStore(null);
          setQuery('');
          setMessage({ type: '', text: '' });
          closeModal();
        }, 1500);
      } else {
        let errorText = 'Gagal membuat supervisor. Silakan coba lagi.';

        if (response?.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          errorText = response.errors.join(', ');
        } else if (response?.message) {
          errorText = response.message;
        }

        setMessage({
          type: 'error',
          text: errorText
        });
      }
    } catch (error) {
      console.error('Failed to save supervisor:', error);

      let errorText = 'Failed to create supervisor. Please try again.';

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
    setFormData({
      name: '',
      phone: '',
      password: '',
      store_id: '',
    });
    setSelectedStore(null);
    setQuery('');
    setMessage({ type: '', text: '' });
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
                <div className="bg-[#C9F35B] hover:bg-[#B8E047]  px-6 py-4">
                  <Dialog.Title className="text-xl font-semibold text-black">
                    Tambah Supervisor
                  </Dialog.Title>
                </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
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
                        Telepon <span className="text-red-500">*</span>
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
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Masukkan password"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Toko <span className="text-red-500">*</span>
                      </label>
                      <Combobox value={selectedStore} onChange={handleStoreSelect} disabled={submitting}>
                        <div className="relative">
                          <div className="relative">
                            <Combobox.Input
                              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                              displayValue={(store) => store ? `${store.kode_toko} - ${store.name}` : ''}
                              onChange={(event) => setQuery(event.target.value)}
                              placeholder="Cari toko berdasarkan kode atau nama"
                              required
                              disabled={submitting}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                          >
                            <Combobox.Options className="absolute z-10 mt-1 max-h-[280px] w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {loading ? (
                                <div className="px-4 py-2 text-sm text-gray-500">Memuat toko...</div>
                              ) : filteredStores.length === 0 && query !== '' ? (
                                <div className="px-4 py-2 text-sm text-gray-500">Tidak ada toko ditemukan.</div>
                              ) : (
                                filteredStores.map((store) => (
                                  <Combobox.Option
                                    key={store.id}
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                        active ? 'bg-[#C9F35B]/10 text-gray-900' : 'text-gray-900'
                                      }`
                                    }
                                    value={store}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex flex-col">
                                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                            {store.kode_toko} - {store.name}
                                          </span>
                                          <span className="text-xs text-gray-500">{store.address}</span>
                                        </div>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active ? 'text-[#C9F35B]' : 'text-[#C9F35B]'
                                            }`}
                                          >
                                            <Check className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SupervisorFormModal;