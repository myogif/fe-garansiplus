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
import StatCard from '../../components/StatCard';
import { DUMMY_MONTHLY_SUMMARY } from '../../lib/constants';
import MainLayout from '../../components/MainLayout';

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

  const statCards = useMemo(
    () => [
      { title: 'Total Products', value: stats.totalProducts },
      { title: 'Total Stores', value: stats.totalStores },
      { title: 'Total Supervisors', value: stats.totalSupervisors },
      { title: 'Total Sales', value: stats.totalSales },
      { title: 'Total Customers', value: stats.totalCustomers },
    ],
    [stats]
  );

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
        totalProducts: pickNumber(dashboardData, [
          'totalProducts',
          'total_products',
          'totalProduct',
        ]),
        totalStores: pickNumber(dashboardData, ['totalStores', 'total_stores', 'totalStore']),
        totalSupervisors: pickNumber(dashboardData, [
          'totalSupervisors',
          'total_supervisors',
          'totalSupervisor',
        ]),
        totalSales: pickNumber(dashboardData, ['totalSales', 'total_sales', 'totalSale']),
        totalCustomers: pickNumber(dashboardData, [
          'totalCustomers',
          'total_customers',
          'totalCustomer',
        ]),
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
            score: pickNumber(store, ['score', 'total', 'sales', 'value', 'productCount'], null),
            rank: store.rank || index + 1,
          }))
        : [];
      setBestStores(normalizedStores);

      const monthlyData = monthlyRes?.data?.data || monthlyRes?.data || {};
      const monthlyItems =
        monthlyData.items ||
        monthlyData.monthlySummary ||
        monthlyData.monthlyProducts ||
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

  const content = loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
        </div>
      ))}
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statistik Produk Bulanan</h3>
                <p className="text-sm text-gray-500">Data dari /managers/mountly-summary</p>
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
    </>
  );

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="mt-0.5">⚠️</div>
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-red-600 mt-1">Periksa koneksi Anda atau coba muat ulang data.</p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-100"
          >
            <RefreshCw size={14} />
            Muat ulang
          </button>
        </div>
      )}
      {content}
    </MainLayout>
  );
};

export default ManagerDashboard;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const pickNumber = (source, keys, fallback = 0) => {
  if (!source || typeof source !== 'object') return fallback;

  for (const key of keys) {
    const value = source[key];
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const getMonthLabel = (value, fallback) => {
  if (typeof value === 'string') {
    const index = monthNames.findIndex(
      (name) => name.toLowerCase() === value.toLowerCase()
    );

    if (index >= 0) return monthNames[index].slice(0, 3);
    return value.slice(0, 3);
  }

  if (typeof value === 'number') {
    return monthNames[value - 1]?.slice(0, 3) || fallback;
  }

  return fallback;
};

const normalizeMonthly = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => {
    const monthValue =
      item.month ??
      item.month_name ??
      item.monthName ??
      item.name ??
      item.monthNumber ??
      index + 1;

    return {
      month: getMonthLabel(monthValue, `M${index + 1}`),
      total: pickNumber(item, ['total', 'count', 'value', 'productCount', 'products'], 0),
    };
  });
};

const fallbackMonthly = normalizeMonthly(DUMMY_MONTHLY_SUMMARY);

const renderStoreRow = (store, idx) => (
  <div
    key={`store-${store.name}-${idx}`}
    className="py-3 flex items-start gap-3 hover:bg-gray-50 rounded-xl px-2 transition-colors"
  >
    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
      <Crown size={18} />
    </div>

    <div className="flex-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{store.name}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={14} />
            <span className="line-clamp-2">{store.address}</span>
          </div>
        </div>

        {store.score !== null && (
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap">
            {store.score} produk
          </span>
        )}
      </div>
    </div>
  </div>
);
