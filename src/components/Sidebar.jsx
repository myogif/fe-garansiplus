import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const navItems = {
    MANAGER: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/supervisors', icon: Users, label: 'Supervisors' },
    ],
    SUPERVISOR: [
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/supervisors', icon: UserCheck, label: 'Sales' },
    ],
    SALES: [{ to: '/products', icon: Package, label: 'Produk' }],
  };

  const links = navItems[role] || [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[#1a1a1a] text-white w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-1 mb-8">
            <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">GARANSI</span>
              <span className="text-[#C9F35B] text-xl font-bold">+</span>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#2a2a2a] text-white'
                      : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <span className="text-sm">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
