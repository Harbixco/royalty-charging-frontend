import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-core-700 text-white hover:bg-core-800 focus-visible:ring-core-500',
  accent: 'bg-spark-400 text-core-900 hover:bg-spark-500 focus-visible:ring-spark-400',
  secondary: 'bg-white text-core-700 border border-core-200 hover:bg-core-50 focus-visible:ring-core-300',
  ghost: 'bg-transparent text-core-600 hover:bg-core-100 focus-visible:ring-core-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
};

export default Button;
