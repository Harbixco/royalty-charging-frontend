import React from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import StatusBadge from './StatusBadge.jsx';
import { formatNaira } from '../../utils/currency.js';
import { formatDateTime } from '../../utils/date.js';
import { CheckCircle2 } from 'lucide-react';

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-core-50 py-2.5 last:border-0">
    <span className="text-sm text-core-400">{label}</span>
    <span className="text-sm font-medium text-core-800">{value}</span>
  </div>
);

const RecordDetailsModal = ({ record, open, onClose, onComplete, completing }) => {
  if (!record) return null;

  return (
    <Modal open={open} onClose={onClose} title="Charging record details">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-core-800">{record.customerName}</p>
          <p className="text-sm text-core-400">Tag: {record.tagNumber}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="rounded-xl border border-core-100 divide-y divide-core-50">
        <div className="px-4">
          <Row label="Gadget(s)" value={record.gadgetType} />
          {record.items && record.items.length > 1 ? (
            <div className="py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-core-400">Itemized Breakdown</span>
              <div className="mt-1.5 space-y-1.5 rounded-lg bg-core-50 p-2.5">
                {record.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-core-700">
                      {it.gadgetType} ({it.option})
                    </span>
                    <span className="font-semibold text-core-900">{formatNaira(it.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Row label="Option / capacity" value={record.option} />
          )}
          <Row label="Total Amount" value={formatNaira(record.amount)} />
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
