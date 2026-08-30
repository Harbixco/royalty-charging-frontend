import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = ({ title, onOpenMobile }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-core-100 bg-white/90 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-md p-1.5 text-core-500 hover:bg-core-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-core-800 sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full border border-core-100 bg-core-50 py-1 pl-1.5 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-core-700 text-white font-bold text-xs uppercase">
            {user?.username ? user.username.charAt(0) : <User size={14} />}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-core-800">{user?.name || user?.username || 'Admin'}</p>
            <p className="text-[10px] uppercase font-bold text-spark-600">Administrator</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-core-200 bg-white px-3 py-1.5 text-xs font-medium text-core-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors shadow-sm"
          title="Sign out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
