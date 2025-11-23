import { Dialog, Transition, Combobox } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      loadStores();
    }
  }, [isOpen]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await fetchStores();
      setStores(data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
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
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setFormData((prev) => ({ ...prev, store_id: store?.id || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      phone: '',
      password: '',
      store_id: '',
    });
    setSelectedStore(null);
    setQuery('');
    closeModal();
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="bg-gradient-to-r from-[#C9F35B] to-[#B8E047] px-6 py-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Add Supervisor
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all"
                        placeholder="Enter supervisor name"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all"
                        placeholder="Enter phone number"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9F35B] focus:border-transparent transition-all"
                        placeholder="Enter password"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store <span className="text-red-500">*</span>
                      </label>
                      <Combobox value={selectedStore} onChange={handleStoreSelect}>
                        <div className="relative">
                          <div className="relative">
                            <Combobox.Input
                              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              displayValue={(store) => store ? `${store.kode_toko} - ${store.name}` : ''}
                              onChange={(event) => setQuery(event.target.value)}
                              placeholder="Search store by code or name"
                              required
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
                                <div className="px-4 py-2 text-sm text-gray-500">Loading stores...</div>
                              ) : filteredStores.length === 0 && query !== '' ? (
                                <div className="px-4 py-2 text-sm text-gray-500">No stores found.</div>
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
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 text-sm font-medium text-gray-900 bg-[#C9F35B] rounded-xl hover:bg-[#B8E047] transition-colors shadow-sm hover:shadow-md"
                    >
                      Save Supervisor
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
