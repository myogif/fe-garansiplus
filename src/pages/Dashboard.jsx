import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TopStoresList from '../components/TopStoresList';
import { getDashboard } from '../services/managers';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Agustus', value: 30 },
    { name: 'Agustus', value: 40 },
    { name: 'Agustus', value: 80 },
    { name: 'Agustus', value: 50 },
    { name: 'Agustus', value: 20 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              title="Total Produk"
              value={dashboardData?.totalProducts || 0}
            />
            <StatCard
              title="Total Toko"
              value={dashboardData?.totalStores || 0}
            />
            <StatCard
              title="Total Supervisor"
              value={dashboardData?.totalSupervisors || 0}
            />
            <StatCard
              title="Total Sales"
              value={dashboardData?.totalSales || 0}
            />
            <StatCard
              title="Total Customer"
              value={dashboardData?.totalCustomers || 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">Statistik</h3>
                <p className="text-sm text-gray-500">Produk Bulanan</p>
              </div>

              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#C9F35B] rounded-full"></div>
                  <span className="text-sm text-gray-600">Product</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#C9F35B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <TopStoresList stores={dashboardData?.topTenStores || []} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
