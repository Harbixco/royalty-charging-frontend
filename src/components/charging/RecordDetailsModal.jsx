import React from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import StatusBadge, { PaymentBadge } from './StatusBadge.jsx';
import { formatNaira } from '../../utils/currency.js';
import { formatDateTime } from '../../utils/date.js';
import { CheckCircle2, Check, XCircle } from 'lucide-react';

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-core-50 py-2.5 last:border-0">
    <span className="text-sm text-core-400">{label}</span>
    <span className="text-sm font-medium text-core-800">{value}</span>
  </div>
);

const RecordDetailsModal = ({ record, open, onClose, onComplete, onTogglePayment, completing }) => {
  if (!record) return null;

  return (
    <Modal open={open} onClose={onClose} title="Charging record details">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-core-800">{record.customerName}</p>
          <p className="text-sm text-core-400">Tag: {record.tagNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentBadge status={record.paymentStatus || 'Unpaid'} />
          <StatusBadge status={record.status} />
        </div>
      </div>

      <div className="rounded-xl border border-core-100 divide-y divide-core-50">
        <div className="px-4">
          <Row label="Gadget(s)" value={record.gadgetType} />
          {record.items && record.items.length > 0 ? (
            <div className="py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-core-400">Itemized Gadgets</span>
              <div className="mt-1.5 space-y-1.5 rounded-lg bg-core-50 p-2.5">
                {record.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {it.charged !== false ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      <span className={it.charged !== false ? 'font-medium text-core-700' : 'text-core-400 line-through'}>
                        {it.gadgetType} ({it.option})
                      </span>
                    </div>
                    <span className={it.charged !== false ? 'font-semibold text-core-900' : 'text-red-500 line-through'}>
                      {formatNaira(it.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Row label="Option / capacity" value={record.option} />
          )}
          <Row
            label="Total Amount"
            value={
              <span>
                {formatNaira(record.amount)}
                {record.originalAmount && record.amount < record.originalAmount && (
                  <span className="ml-1.5 text-xs text-core-400 line-through">
                    {formatNaira(record.originalAmount)}
                  </span>
                )}
              </span>
            }
          />
          <div className="flex items-center justify-between border-b border-core-50 py-2.5">
            <span className="text-sm text-core-400">Payment Status</span>
            <div className="flex items-center gap-2">
              <PaymentBadge status={record.paymentStatus || 'Unpaid'} />
              {onTogglePayment && (
                <button
                  type="button"
                  onClick={() => onTogglePayment(record)}
                  className="text-xs font-medium text-core-600 hover:text-core-900 underline"
                >
                  Change
                </button>
              )}
            </div>
          </div>
          <Row label="Created" value={formatDateTime(record.createdAt)} />
          {record.completedAt && <Row label="Completed" value={formatDateTime(record.completedAt)} />}
          {record.notes && <Row label="Notes" value={record.notes} />}
        </div>
      </div>

      {record.status !== 'Completed' && (
        <Button
          variant="accent"
          icon={CheckCircle2}
          className="mt-5 w-full"
          loading={completing}
          onClick={() => onComplete(record)}
        >
          Mark as Completed
        </Button>
      )}
    </Modal>
  );
};

export default RecordDetailsModal;
