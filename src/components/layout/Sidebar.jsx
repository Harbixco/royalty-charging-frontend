import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/nav.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';
import Logo from './Logo.jsx';

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-white/10 text-white' : 'text-core-300 hover:bg-white/5 hover:text-white'
    }`;

  const content = (
    <div className="flex h-full flex-col bg-core-800">
      <div className="flex items-center justify-between px-5 py-6">
        <Logo />
        <button
          onClick={onCloseMobile}
          className="rounded-md p-1 text-core-300 hover:bg-white/10 lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.label} to={item.to} end={item.end} className={linkClass} onClick={onCloseMobile}>
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-3.5 flex items-center justify-between">
        <span className="text-xs text-core-400">Royalty v1.0</span>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
          title="Sign out"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-core-900/50" onClick={onCloseMobile} />
          <div className="relative z-10 h-full w-64">{content}</div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        variant="danger"
        title="Confirm Logout"
        message="Are you sure you want to sign out of the Royalty Charging admin portal?"
        confirmText="Sign Out"
        details={
          user && (
            <div className="flex justify-between">
              <span className="text-core-500">Active Account:</span>
              <span className="font-semibold text-core-800">{user.username || user.name || 'Admin'}</span>
            </div>
          )
        }
      />
    </>
  );
};

export default Sidebar;
