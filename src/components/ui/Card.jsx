import React from 'react';

const Card = ({ children, className = '', padded = true, ...props }) => (
  <div
    className={`rounded-2xl border border-core-100 bg-surface shadow-card ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
