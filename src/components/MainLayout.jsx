import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c101c]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 bg-[#0c101c] px-4 sm:px-6 lg:px-8 pb-10 pt-6 lg:pt-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
