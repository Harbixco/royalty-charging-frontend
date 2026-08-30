import React from 'react';

// The "charge bars" signature mark: three bars of ascending height,
// echoing a battery/signal charge indicator — reused across the app.
const Logo = ({ collapsed = false }) => (
  <div className="flex items-center gap-2.5">
    <div className="charge-bars text-spark-400">
      <span className="h-2.5" />
      <span className="h-4" />
      <span style={{ height: '1.375rem' }} />
    </div>
    {!collapsed && (
      <span className="font-display text-[15px] font-semibold leading-tight text-white">
        Royalty <span className="text-spark-400">Charging</span>
      </span>
    )}
  </div>
);

export default Logo;
