import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ title, onOpenMobile }) => {
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
    </header>
  );
};

export default Navbar;
