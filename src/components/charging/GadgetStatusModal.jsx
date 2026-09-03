import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { formatNaira } from '../../utils/currency.js';
import { CheckCircle2, XCircle, Zap, ShieldAlert, Smartphone, Laptop, Monitor, BatteryCharging, Lightbulb } from 'lucide-react';

const getGadgetIcon = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('phone')) return Smartphone;
  if (t.includes('laptop')) return Laptop;
  if (t.includes('desktop')) return Monitor;
  if (t.includes('power') || t.includes('bank')) return BatteryCharging;
  if (t.includes('lamp')) return Lightbulb;
  return Zap;
};

const GadgetStatusModal = ({ gadget, open, onClose, onSave }) => {
  const [selectedCharged, setSelectedCharged] = useState(true);

  useEffect(() => {
    if (gadget) {
      setSelectedCharged(gadget.charged !== false);
    }
  }, [gadget, open]);

  if (!gadget) return null;

  const GadgetIcon = getGadgetIcon(gadget.gadgetType);

  const handleSave = () => {
    onSave(gadget.index, selectedCharged);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Gadget Status"
      maxWidth="max-w-md"
      zIndex="z-50"
    >
      <div className="space-y-4">
        {/* Gadget Details Header */}
        <div className="flex items-center gap-3.5 rounded-xl border border-core-100 bg-core-50/70 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-spark-500/10 text-spark-600">
            <GadgetIcon size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-display text-base font-bold text-core-900 truncate">
              {gadget.gadgetType}
            </h4>
            <p className="text-xs text-core-500 truncate">{gadget.option}</p>
          </div>
          <div className="text-right">
            <span className="font-display text-sm font-bold text-core-900">
              {formatNaira(gadget.amount)}
            </span>
          </div>
        </div>

        <p className="text-xs text-core-500 font-medium">
          Select whether this gadget completed charging before completing handover:
        </p>

        {/* Selection Cards */}
        <div className="grid gap-3">
          {/* Option: Charged */}
          <button
            type="button"
            onClick={() => setSelectedCharged(true)}
            className={`group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
              selectedCharged
                ? 'border-emerald-500 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-500/30'
                : 'border-core-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20'
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                selectedCharged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-core-100 text-core-400 group-hover:text-emerald-600'
              }`}
            >
              <CheckCircle2 size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-core-900">
                  Charged (Completed)
                </span>
                {selectedCharged && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Selected
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-core-600">
                Gadget is fully charged. Price of <span className="font-semibold text-emerald-700">{formatNaira(gadget.amount)}</span> will be included in the total.
              </p>
            </div>
          </button>

          {/* Option: Not Charged */}
          <button
            type="button"
            onClick={() => setSelectedCharged(false)}
            className={`group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
              !selectedCharged
                ? 'border-rose-500 bg-rose-50/60 shadow-sm ring-1 ring-rose-500/30'
                : 'border-core-200 bg-white hover:border-rose-300 hover:bg-rose-50/20'
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                !selectedCharged
                  ? 'bg-rose-600 text-white'
                  : 'bg-core-100 text-core-400 group-hover:text-rose-600'
              }`}
            >
              <XCircle size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-core-900">
                  Not Charged
                </span>
                {!selectedCharged && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                    Selected
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-core-600">
                Gadget did not charge. <span className="font-semibold text-rose-700">{formatNaira(gadget.amount)}</span> will be deducted from customer bill.
              </p>
            </div>
          </button>
        </div>

        {/* Notice on uncharged */}
        {!selectedCharged && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
            <ShieldAlert size={16} className="shrink-0 text-amber-600" />
            <span>Marking this gadget as uncharged will deduct {formatNaira(gadget.amount)} from total revenue.</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-core-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleSave}
            className={selectedCharged ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}
          >
            Apply Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GadgetStatusModal;
