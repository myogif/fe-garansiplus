import { useState } from 'react';
import { Menu, Search, User, ChevronDown, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu as HeadlessMenu } from '@headlessui/react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#0b0f1e] text-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <button
            onClick={onMenuClick}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari …"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12172a] border border-white/10 text-white placeholder:text-white/50 rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9F35B]"
              />
            </div>
          </div>

          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 rounded-full bg-[#4fb8b8] flex items-center justify-center shadow-inner">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold leading-tight">{user?.name || 'User'}</span>
                <span className="text-xs text-white/60 leading-tight">{user?.role || 'Role'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </HeadlessMenu.Button>

            <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-[#12172a] border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate('/update-password')}
                      className={`${
                        active ? 'bg-white/5' : ''
                      } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white transition-colors`}
                    >
                      <Lock className="w-4 h-4 text-white/60" />
                      Update Password
                    </button>
                  )}
                </HeadlessMenu.Item>
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-white/5' : ''
                      } group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white transition-colors`}
                    >
                      <LogOut className="w-4 h-4 text-white/60" />
                      Sign out
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </HeadlessMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
