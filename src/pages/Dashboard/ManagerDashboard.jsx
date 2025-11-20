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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Supervisors" value={stats.totalSupervisors} />
        <StatCard title="Total Sales" value={stats.totalSales} />
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
    </>
  );

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      {content}
    </MainLayout>
  );
};

export default ManagerDashboard;
