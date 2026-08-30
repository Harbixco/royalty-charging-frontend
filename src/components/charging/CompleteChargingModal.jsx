import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { formatNaira } from '../../utils/currency.js';
import { CheckCircle2, AlertCircle, Zap, XCircle, Check, DollarSign } from 'lucide-react';

const CompleteChargingModal = ({ record, open, onClose, onConfirm, loading }) => {
  const [gadgetStates, setGadgetStates] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');

  // Initialize gadget states when modal opens or record changes
  useEffect(() => {
    if (!record) return;

    setPaymentStatus(record.paymentStatus || 'Unpaid');

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
      // Legacy or single gadget fallback
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
  }, [record, open]);

  // Toggle charged status for a gadget
  const toggleCharged = (index) => {
    setGadgetStates((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, charged: !item.charged } : item))
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
      paymentStatus: allUncharged ? 'Paid' : paymentStatus,
      recalculatedAmount: chargedTotal,
    });
  };

  if (!record) return null;

  return (
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
              Verify Gadgets ({chargedCount} of {gadgetStates.length} charged)
            </label>
            <span className="text-[11px] text-core-500">Click if a gadget did not charge</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
            {gadgetStates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleCharged(idx)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                  item.charged
                    ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80'
                    : 'border-red-200 bg-red-50/40 opacity-75 hover:opacity-100 hover:bg-red-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      item.charged ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
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

                <div className="text-right">
                  <span
                    className={`font-display text-sm font-bold ${
                      item.charged ? 'text-emerald-700' : 'text-red-500 line-through'
                    }`}
                  >
                    {formatNaira(item.amount)}
                  </span>
                  <p className={`text-[11px] font-semibold ${item.charged ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.charged ? 'Charged' : 'Not Charged'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Revenue & Deduction Summary */}
        <div className="rounded-xl border border-core-200 bg-canvas p-3.5 space-y-2">
          {unchargedDeduction > 0 && (
            <div className="flex items-center justify-between text-xs text-red-600 font-medium">
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
              ⚠️ None of the gadgets charged. The amount will be set to ₦0 and deducted from total income.
            </p>
          )}
        </div>

        {/* Payment Confirmation */}
        {!allUncharged && (
          <div className="rounded-xl border border-core-100 bg-core-50/60 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-core-600">Payment on Handover</p>
                <p className="text-xs text-core-500">Collect {formatNaira(chargedTotal)} from customer</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('Unpaid')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    paymentStatus === 'Unpaid'
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-core-700 border-core-200 hover:bg-core-100'
                  }`}
                >
                  Unpaid
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('Paid')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    paymentStatus === 'Paid'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-core-700 border-core-200 hover:bg-core-100'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
        )}

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
  );
};

export default CompleteChargingModal;
