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
      { title: 'Total Produk', value: stats.totalProducts },
      { title: 'Total Toko', value: stats.totalStores },
      { title: 'Total Supervisor', value: stats.totalSupervisors },
      { title: 'Total Sales', value: stats.totalSales },
      { title: 'Total Customer', value: stats.totalProducts },
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
            productCount: pickNumber(store, ['productCount', 'product_count', 'totalProducts'], 0),
            score: pickNumber(store, ['score', 'total', 'sales', 'value', 'productCount'], null),
            rank: store.rank || index + 1,
          }))
        : [];
      setBestStores(normalizedStores);

      const monthlyDataRaw = monthlyRes?.data?.data || monthlyRes?.data || {};
      const monthlyItems =
        monthlyDataRaw.items ||
        monthlyDataRaw.monthlySummary ||
        monthlyDataRaw.monthlyProducts ||
        monthlyDataRaw.monthly ||
        monthlyDataRaw.data ||
        monthlyRes?.data?.items ||
        [];

      const normalizedMonthly = normalizeMonthly(monthlyItems);
      const finalMonthlyData = normalizedMonthly.length ? normalizedMonthly : fallbackMonthly;
      setMonthlySummary(finalMonthlyData.slice(-6));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Gagal memuat dashboard. Silakan coba lagi.');
      setMonthlySummary(fallbackMonthly.slice(-6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const content = loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-lg animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-8 bg-gray-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {statCards.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="bg-gray-100 rounded-3xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-md">
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Statistik</p>
              <h3 className="text-2xl font-bold text-gray-900">Produk Bulanan</h3>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySummary} barSize={40}>
                  <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#9ca3af', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(199, 240, 100, 0.1)' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    fill="#C7F064"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="inline-block w-3 h-3 rounded-full bg-[#C7F064]" />
              <span className="text-sm text-gray-600">Product</span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Toko Terbaik!</h3>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={`store-skeleton-${idx}`} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : bestStores.length ? (
              <div className="space-y-1">
                {bestStores.slice(0, 4).map((store, idx) => renderStoreRow(store, idx))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                Belum ada data toko terbaik.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout>
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
    className="py-4 flex items-start gap-3 border-b border-gray-100 last:border-0"
  >
    <div className="flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 text-sm">#{idx + 1}</span>
            <span className="font-semibold text-gray-900">{store.name}</span>
            {idx === 0 && (
              <Crown size={16} className="text-[#C7F064] fill-[#C7F064]" />
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Total Produk: {store.productCount || 0}
          </p>
        </div>
      </div>
    </div>
  </div>
);
