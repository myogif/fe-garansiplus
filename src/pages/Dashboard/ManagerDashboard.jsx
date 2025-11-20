import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Crown, MapPin, RefreshCw } from 'lucide-react';
import { getDashboardSummary, getMonthlySummary } from '../../api/managers';
import MainLayout from '../../components/MainLayout';

const pickNumber = (source, keys, fallback = 0) => {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return fallback;
};

const normalizeMonthly = (items = []) =>
  items
    .map((item, idx) => {
      const month =
        item.month ||
        item.name ||
        item.label ||
        item.monthName ||
        `Bulan ${idx + 1}`;
      const total = pickNumber(item, ['total', 'count', 'value', 'amount'], 0);
      return { month, total };
    })
    .filter((item) => item);

const fallbackMonthly = [
  { month: 'Juli', total: 120 },
  { month: 'Agustus', total: 180 },
  { month: 'September', total: 240 },
];

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStores: 0,
    totalSupervisors: 0,
    totalSales: 0,
    totalCustomers: 0,
  });
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [bestStores, setBestStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboardRes, monthlyRes] = await Promise.all([
        getDashboardSummary(),
        getMonthlySummary(),
      ]);

      const dashboardData = dashboardRes?.data?.data || dashboardRes?.data || {};

      setStats({
        totalProducts: pickNumber(dashboardData, ['totalProducts', 'total_products', 'totalProduct']),
        totalStores: pickNumber(dashboardData, ['totalStores', 'total_stores', 'totalStore']),
        totalSupervisors: pickNumber(dashboardData, ['totalSupervisors', 'total_supervisors', 'totalSupervisor']),
        totalSales: pickNumber(dashboardData, ['totalSales', 'total_sales', 'totalSale']),
        totalCustomers: pickNumber(dashboardData, ['totalCustomers', 'total_customers', 'totalCustomer']),
      });

      const storesRaw =
        dashboardData.bestStores ||
        dashboardData.topStores ||
        dashboardData.topTenStores ||
        dashboardData.stores ||
        [];
      const normalizedStores = Array.isArray(storesRaw)
        ? storesRaw.map((store, index) => ({
            name: store.name || store.storeName || store.title || `Toko ${index + 1}`,
            address: store.address || store.storeAddress || store.location || 'Alamat tidak tersedia',
            score: pickNumber(store, ['score', 'total', 'sales', 'value'], null),
            rank: store.rank || index + 1,
          }))
        : [];
      setBestStores(normalizedStores);

      const monthlyData = monthlyRes?.data?.data || monthlyRes?.data || {};
      const monthlyItems =
        monthlyData.items ||
        monthlyData.monthlySummary ||
        monthlyData.monthly ||
        monthlyData.data ||
        monthlyRes?.data?.items ||
        [];

      const normalizedMonthly = normalizeMonthly(monthlyItems);
      setMonthlySummary(normalizedMonthly.length ? normalizedMonthly : fallbackMonthly);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Gagal memuat dashboard. Silakan coba lagi.');
      setMonthlySummary(fallbackMonthly);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = useMemo(
    () => [
      { label: 'Total Product', value: stats.totalProducts },
      { label: 'Total Toko', value: stats.totalStores },
      { label: 'Total Supervisor', value: stats.totalSupervisors },
      { label: 'Total Sales', value: stats.totalSales },
      { label: 'Total Customer', value: stats.totalCustomers },
    ],
    [stats]
  );

  const renderLoadingBars = Array.from({ length: 5 }).map((_, idx) => (
    <div
      key={`skeleton-${idx}`}
      className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 animate-pulse h-28"
    >
      <div className="w-24 h-4 bg-white/10 rounded" />
      <div className="mt-4 w-16 h-7 bg-white/20 rounded" />
    </div>
  ));

  const renderStoreRow = (store, index) => {
    const isTop = index === 0;
    return (
      <div
        key={`${store.name}-${index}`}
        className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            isTop ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {isTop ? <Crown className="w-5 h-5" /> : `#${store.rank || index + 1}`}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{store.name}</p>
            {typeof store.score === 'number' && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{store.score}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {store.address}
          </p>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-sm text-gray-600">Pantau performa produk, toko, dan tim Anda.</p>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4" />
              Muat ulang
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {loading
            ? renderLoadingBars
            : statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-[#0f172a] border border-white/5 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col gap-3"
                >
                  <p className="text-sm text-white/60">{card.label}</p>
                  <p className="text-3xl font-semibold text-white">{card.value ?? 0}</p>
                </div>
              ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statistik Produk Bulanan</h3>
                <p className="text-sm text-gray-500">Data dari /api/managers/products/monthly-summary</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                <span>Product</span>
              </div>
            </div>

            <div className="h-[320px]">
              {loading ? (
                <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySummary} barSize={38}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Toko Terbaik!</h3>
              <span className="text-xs font-semibold bg-[#0f172a] text-white px-3 py-1 rounded-full">Top List</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Peringkat toko performa terbaik bulan ini.</p>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={`store-skeleton-${idx}`} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : bestStores.length ? (
              <div className="divide-y divide-gray-100">
                {bestStores.map((store, idx) => renderStoreRow(store, idx))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                Belum ada data toko terbaik.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManagerDashboard;
