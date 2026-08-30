import React from 'react';

const VARIANTS = {
  neutral: 'bg-core-100 text-core-700',
  accent: 'bg-spark-100 text-spark-600',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANTS[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
