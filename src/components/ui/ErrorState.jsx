import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-14 text-center">
    <div className="rounded-full bg-white p-3 shadow-card">
      <AlertTriangle size={22} className="text-red-500" />
    </div>
    <p className="max-w-sm text-sm font-medium text-red-700">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
