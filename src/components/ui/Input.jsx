import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, hint, className = '', id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-core-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-core-800 placeholder:text-core-400 transition-colors focus:outline-none focus:ring-2 focus:ring-core-400 focus:border-transparent ${
          error ? 'border-red-300 bg-red-50' : 'border-core-200 bg-white'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-core-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
