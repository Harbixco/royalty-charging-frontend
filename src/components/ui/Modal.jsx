import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-core-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-card-hover`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-core-100 bg-white px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-core-800">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-core-400 hover:bg-core-100 hover:text-core-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-core-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
