import React from 'react';
import { AlertTriangle, CheckCircle2, Trash2, X } from 'lucide-react';
import Button from './Button.jsx';

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary', 'danger', 'success'
  loading = false,
  details,
}) => {
  if (!open) return null;

  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success' || variant === 'accent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-core-950/60 backdrop-blur-sm transition-opacity"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isDanger
                  ? 'bg-red-100 text-red-600'
                  : isSuccess
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-spark-100 text-spark-700'
              }`}
            >
              {isDanger ? (
                <Trash2 size={24} />
              ) : isSuccess ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-core-900">{title}</h3>
              <p className="mt-1.5 text-sm text-core-600 leading-relaxed">{message}</p>

              {details && (
                <div className="mt-3 rounded-lg border border-core-100 bg-core-50 p-3 text-xs text-core-700 space-y-1">
                  {details}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-1 text-core-400 hover:bg-core-100 hover:text-core-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={loading}
              onClick={onClose}
            >
              {cancelText}
            </Button>

            <Button
              type="button"
              variant={isDanger ? 'danger' : 'accent'}
              size="md"
              loading={loading}
              onClick={onConfirm}
              icon={isDanger ? Trash2 : CheckCircle2}
              className={!isDanger ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
