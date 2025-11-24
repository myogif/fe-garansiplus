import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const navItems = {
    MANAGER: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/stores', icon: Store, label: 'Toko' },
      { to: '/supervisors', icon: Users, label: 'Supervisor' },
      { to: '/sales', icon: UserCheck, label: 'Sales' },
    ],
    SERVICE_CENTER: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/stores', icon: Store, label: 'Toko' },
      { to: '/supervisors', icon: Users, label: 'Supervisor' },
      { to: '/sales', icon: UserCheck, label: 'Sales' },
      { to: '/customers', icon: Users, label: 'Customer' },
    ],
    SUPERVISOR: [
      { to: '/products', icon: Package, label: 'Produk' },
      { to: '/sales', icon: UserCheck, label: 'Sales' },
    ],
    SALES: [{ to: '/products', icon: Package, label: 'Produk' }],
  };

  const links = navItems[role] || [];

  // Menutup sidebar saat tekan tombol ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - klik di luar sidebar untuk menutup */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0b0f1e] text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6 gap-8">
          <div className="flex items-center justify-between py-2">
            <img
              src="/Rectangle 5.png"
              alt="Garansi+"
              className="h-12 w-auto object-contain"
            />
            {/* Tombol Close (X) - muncul di semua ukuran layar */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Tutup sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1" onClick={(e) => e.stopPropagation()}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium border border-transparent ${
                    isActive
                      ? 'bg-[#12172a] text-white border-l-4 border-[#C9F35B]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
                onClick={onClose}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Area kosong di bawah menu - klik untuk menutup */}
          <div className="flex-1" onClick={onClose}></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;