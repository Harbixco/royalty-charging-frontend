import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-2xl border border-core-100 bg-surface shadow-card">
    <table className={`w-full min-w-[720px] text-left text-sm ${className}`}>{children}</table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="border-b border-core-100 bg-core-50/60">
    <tr>{children}</tr>
  </thead>
);

export const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-core-500 ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-4 py-3.5 align-middle text-core-700 ${className}`}>{children}</td>
);

export const Tr = ({ children, className = '', ...props }) => (
  <tr className={`border-b border-core-50 last:border-0 hover:bg-core-50/50 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);
