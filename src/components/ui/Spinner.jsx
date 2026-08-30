import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ label = 'Loading…', size = 20, className = '' }) => (
  <div className={`flex flex-col items-center justify-center gap-2 py-10 text-core-400 ${className}`}>
    <Loader2 size={size} className="animate-spin" />
    {label && <span className="text-sm">{label}</span>}
  </div>
);

export default Spinner;
