import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardSummary, getMonthlySummary } from '../../api/managers';
import StatCard from '../../components/StatCard';
import { DUMMY_MONTHLY_SUMMARY } from '../../lib/constants';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    supervisors: 0,
    sales: 0,
    products: 0,
  });
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, monthlyRes] = await Promise.all([
          getDashboardSummary(),
          getMonthlySummary(),
        ]);

        const statsData = dashboardRes.data?.data || {};
        setStats(statsData);

        const monthlyData = monthlyRes.data?.data || {};
        const summaryItems = monthlyData.items ?? monthlyRes.data?.items ?? [];
        setMonthlySummary(summaryItems);
      } catch (error) {
        setMonthlySummary(DUMMY_MONTHLY_SUMMARY);
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Supervisors" value={stats.totalSupervisors} />
        <StatCard title="Total Sales" value={stats.totalSales} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Monthly Product Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlySummary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerDashboard;
