import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import GadgetStatusModal from './GadgetStatusModal.jsx';
import { formatNaira } from '../../utils/currency.js';
import { CheckCircle2, AlertCircle, Zap, XCircle, Check, DollarSign, ChevronRight, Edit3 } from 'lucide-react';

const CompleteChargingModal = ({ record, open, onClose, onConfirm, loading }) => {
  const [gadgetStates, setGadgetStates] = useState([]);
  const [activeGadgetToEdit, setActiveGadgetToEdit] = useState(null);

  // Initialize gadget states when modal opens or record changes
  useEffect(() => {
    if (!record) return;

    if (record.items && record.items.length > 0) {
      setGadgetStates(
        record.items.map((it, idx) => ({
          _id: it._id,
          index: idx,
          gadgetType: it.gadgetType,
          option: it.option,
          pricingKey: it.pricingKey,
          amount: it.amount,
          charged: it.charged !== false, // default to true
        }))
      );
    } else {
      // Single gadget fallback
      setGadgetStates([
        {
          index: 0,
          gadgetType: record.gadgetType,
          option: record.option,
          pricingKey: record.pricingKey,
          amount: record.amount,
          charged: true,
        },
      ]);
    }
    setActiveGadgetToEdit(null);
  }, [record, open]);

  // Handle saving status from the GadgetStatusModal
  const handleSaveGadgetStatus = (index, charged) => {
    setGadgetStates((prev) =>
      prev.map((item) => (item.index === index ? { ...item, charged } : item))
    );
  };

  // Calculations
  const initialTotal = useMemo(() => {
    return gadgetStates.reduce((sum, it) => sum + (it.amount || 0), 0);
  }, [gadgetStates]);

  const chargedTotal = useMemo(() => {
    return gadgetStates
      .filter((it) => it.charged)
      .reduce((sum, it) => sum + (it.amount || 0), 0);
  }, [gadgetStates]);

  const unchargedDeduction = initialTotal - chargedTotal;
  const chargedCount = gadgetStates.filter((it) => it.charged).length;
  const allUncharged = chargedCount === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!record) return;

    onConfirm({
      items: gadgetStates.map((it) => ({
        _id: it._id,
        index: it.index,
        pricingKey: it.pricingKey,
        option: it.option,
        amount: it.amount,
        charged: it.charged,
      })),
      paymentStatus: 'Paid', // Automatically marked as 'Paid' on handover completion
      recalculatedAmount: chargedTotal,
    });
  };

  if (!record) return null;

  return (
    <>
      <Modal open={open} onClose={onClose} title="Complete Charging & Handover">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Header */}
          <div className="flex items-center justify-between rounded-xl bg-core-50 p-3.5 border border-core-100">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-core-500">Customer</p>
              <p className="font-display text-base font-bold text-core-900">{record.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-core-500">Tag Number</p>
              <p className="font-mono text-base font-bold text-core-900">{record.tagNumber}</p>
            </div>
          </div>

          {/* Gadgets Verification Section */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-core-600">
                Gadgets ({chargedCount} of {gadgetStates.length} charged)
              </label>
              <span className="text-[11px] font-medium text-spark-600">Click gadget to mark status</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
              {gadgetStates.map((item) => (
                <div
                  key={item.index}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveGadgetToEdit(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveGadgetToEdit(item);
                    }
                  }}
                  className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-spark-400 ${
                    item.charged
                      ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-300'
                      : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        item.charged ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.charged ? <Check size={16} /> : <XCircle size={16} />}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${item.charged ? 'text-core-900' : 'text-core-600 line-through'}`}>
                        {item.gadgetType}
                      </p>
                      <p className="text-xs text-core-500">{item.option}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span
                        className={`font-display text-sm font-bold ${
                          item.charged ? 'text-emerald-700' : 'text-rose-500 line-through'
                        }`}
                      >
                        {formatNaira(item.amount)}
                      </span>
                      <p className={`text-[11px] font-bold ${item.charged ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.charged ? 'Charged' : 'Not Charged'}
                      </p>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-core-400 border border-core-100 group-hover:border-core-300 group-hover:text-core-700 transition-colors">
                      <Edit3 size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Revenue & Deduction Summary */}
          <div className="rounded-xl border border-core-200 bg-canvas p-3.5 space-y-2">
            {unchargedDeduction > 0 && (
              <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
                <span>Uncharged Gadget Deduction:</span>
                <span>-{formatNaira(unchargedDeduction)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-core-100 pt-2">
              <span className="text-sm font-bold text-core-800">Final Payable Amount:</span>
              <span className="font-display text-xl font-bold text-core-900">
                {formatNaira(chargedTotal)}
              </span>
            </div>
            {allUncharged && (
              <p className="text-xs text-amber-700 font-medium">
                ⚠️ None of the gadgets charged. Total amount is ₦0 and will be marked as settled.
              </p>
            )}
          </div>

          {/* Automatic Paid Status Notice */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Automatic Payment Update</p>
                <p className="text-xs text-emerald-700">
                  Completing handover will automatically mark this record as <strong className="font-bold text-emerald-950">Paid</strong>.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              <Check size={13} /> Paid
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-core-100">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              icon={CheckCircle2}
              loading={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold"
            >
              Confirm & Complete Handover
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sub-modal: Mark individual gadget as charged / not charged */}
      <GadgetStatusModal
        gadget={activeGadgetToEdit}
        open={Boolean(activeGadgetToEdit)}
        onClose={() => setActiveGadgetToEdit(null)}
        onSave={handleSaveGadgetStatus}
      />
    </>
  );
};

export default CompleteChargingModal;

