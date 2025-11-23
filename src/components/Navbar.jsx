import { useState } from 'react';
import { Menu, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-[#0b0f1e] text-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/70 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/image.png"
              alt="Garansi+"
              className="h-8 w-auto object-contain"
            />
          </div>

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

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#4fb8b8] flex items-center justify-center shadow-inner">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold leading-tight">{user?.name || 'User'}</span>
              <span className="text-xs text-white/60 leading-tight">{user?.role || 'Role'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
