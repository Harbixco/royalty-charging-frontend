import React, { useEffect, useState } from 'react';
import {
  Pencil,
  Check,
  X,
  Info,
  RotateCcw,
  Plus,
  Trash2,
  Smartphone,
  Laptop,
  Monitor,
  Lightbulb,
  BatteryCharging,
  Plug,
  Zap,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { pricingApi } from '../services/api.js';
import { formatNaira } from '../utils/currency.js';
import { useToast } from '../context/ToastContext.jsx';

const GADGET_ICONS = {
  Phone: Smartphone,
  Laptop: Laptop,
  Desktop: Monitor,
  Lamp: Lightbulb,
  'Power Bank': BatteryCharging,
};

const PriceRow = ({ item, onSaved, onDeleteRequest }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.price);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const save = async () => {
    const price = Number(value);
    if (Number.isNaN(price) || price < 0) {
      toast.error('Enter a valid, non-negative price');
      return;
    }
    setSaving(true);
    try {
      const res = await pricingApi.update(item._id, { price });
      toast.success(`${item.gadgetType} (${item.optionLabel}) price updated to ${formatNaira(price)}`);
      onSaved(res.data);
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setValue(item.price);
    setEditing(false);
  };

  const isPhone = item.gadgetType === 'Phone';
  const isWithCharger = item.key === 'PHONE_WITH_CHARGER';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-core-100 px-5 py-4 last:border-0 hover:bg-core-50/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-core-100 text-core-700">
          {isPhone ? (
            isWithCharger ? <Plug size={18} /> : <Zap size={18} />
          ) : (
            React.createElement(GADGET_ICONS[item.gadgetType] || Zap, { size: 18 })
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-core-800">{item.optionLabel}</p>
            {isPhone && (
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                  isWithCharger ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isWithCharger ? 'Customer charger' : 'Shop charger'}
              </span>
            )}
          </div>
          <p className="text-xs text-core-400">
            Identifier key: <code className="text-core-500 font-mono text-[11px]">{item.key}</code>
          </p>
        </div>
      </div>

      {editing ? (
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-core-400">
              ₦
            </span>
            <input
              type="number"
              min="0"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') cancel();
              }}
              className="w-32 rounded-lg border border-core-300 py-1.5 pl-7 pr-2.5 text-sm font-semibold text-core-800 focus:outline-none focus:ring-2 focus:ring-core-500"
            />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
            title="Save price change"
          >
            <Check size={14} />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={cancel}
            className="rounded-lg bg-core-100 p-1.5 text-core-600 hover:bg-core-200"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="font-display text-lg font-bold text-core-900 mr-2">{formatNaira(item.price)}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-core-200 bg-white px-2.5 py-1.5 text-xs font-medium text-core-700 hover:border-core-300 hover:bg-core-50 shadow-sm transition-colors"
            title="Change price"
          >
            <Pencil size={13} />
            <span>Change Price</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(item)}
            className="rounded-lg p-1.5 text-core-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete gadget pricing"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

const Pricing = () => {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // New Gadget Form State
  const [newGadgetType, setNewGadgetType] = useState('');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [creating, setCreating] = useState(false);
  const [createErrors, setCreateErrors] = useState({});

  const toast = useToast();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pricingApi.list();
      setPricing(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = (updated) => {
    setPricing((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all prices back to default factory pricing?')) return;
    setResetting(true);
    try {
      const res = await pricingApi.resetDefaults();
      setPricing(res.data || []);
      toast.success('Prices reset to defaults');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResetting(false);
    }
  };

  const handleCreateGadget = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newGadgetType.trim()) errors.gadgetType = 'Gadget name is required';
    if (!newPrice || Number.isNaN(Number(newPrice)) || Number(newPrice) < 0) {
      errors.price = 'Please enter a valid price in Naira (≥ 0)';
    }

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    setCreating(true);
    try {
      const res = await pricingApi.create({
        gadgetType: newGadgetType.trim(),
        optionLabel: newOptionLabel.trim() || 'Standard',
        price: Number(newPrice),
      });
      toast.success(`Created gadget "${res.data.gadgetType}" at ${formatNaira(res.data.price)}`);
      setNewGadgetType('');
      setNewOptionLabel('');
      setNewPrice('');
      setCreateErrors({});
      setShowAddModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await pricingApi.remove(itemToDelete._id);
      toast.success(`Removed "${itemToDelete.gadgetType} (${itemToDelete.optionLabel})" from pricing`);
      setItemToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const grouped = pricing.reduce((acc, p) => {
    acc[p.gadgetType] = acc[p.gadgetType] || [];
    acc[p.gadgetType].push(p);
    return acc;
  }, {});

  const existingGadgetTypes = Object.keys(grouped);

  return (
    <DashboardLayout title="Gadget Pricing Configuration">
      <div className="space-y-5">
        {/* Top Actions & Info Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-core-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3 text-sm text-core-600">
            <Info size={20} className="mt-0.5 shrink-0 text-spark-600" />
            <div>
              <p className="font-semibold text-core-800">Admin Pricing Management</p>
              <p className="text-xs text-core-500 mt-0.5">
                Set rates for each gadget or create new gadgets. Changes apply immediately to new charging sessions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <Button
              variant="accent"
              size="md"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial font-semibold shadow-sm"
            >
              Add New Gadget
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={RotateCcw}
              loading={resetting}
              onClick={handleReset}
              title="Reset to factory default prices"
            >
              Reset Defaults
            </Button>
          </div>
        </div>

        {loading && <Spinner label="Loading gadget pricing…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading &&
          !error &&
          Object.entries(grouped).map(([gadgetType, items]) => {
            const Icon = GADGET_ICONS[gadgetType] || Zap;
            return (
              <Card key={gadgetType} padded={false} className="overflow-hidden shadow-sm">
                <div className="flex items-center justify-between bg-core-50/80 px-5 py-3.5 border-b border-core-100">
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className="text-core-700" />
                    <h2 className="font-display text-base font-bold text-core-900">{gadgetType}</h2>
                  </div>
                  <span className="rounded-full bg-core-200/70 px-2.5 py-0.5 text-xs font-semibold text-core-700">
                    {items.length} {items.length === 1 ? 'option' : 'options'}
                  </span>
                </div>
                <div>
                  {items.map((item) => (
                    <PriceRow
                      key={item._id}
                      item={item}
                      onSaved={handleSaved}
                      onDeleteRequest={setItemToDelete}
                    />
                  ))}
                </div>
              </Card>
            );
          })}

        {/* Add New Gadget / Pricing Modal */}
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Gadget & Pricing"
        >
          <form onSubmit={handleCreateGadget} className="space-y-4" noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-core-700">
                Gadget Name / Type
              </label>
              <input
                type="text"
                list="existing-gadgets"
                placeholder="e.g. Tablet, POS Terminal, Rechargeable Fan, Camera"
                value={newGadgetType}
                onChange={(e) => {
                  setNewGadgetType(e.target.value);
                  setCreateErrors((er) => ({ ...er, gadgetType: undefined }));
                }}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-core-800 focus:outline-none focus:ring-2 focus:ring-core-400 ${
                  createErrors.gadgetType ? 'border-red-300 bg-red-50' : 'border-core-200 bg-white'
                }`}
              />
              <datalist id="existing-gadgets">
                {existingGadgetTypes.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
              {createErrors.gadgetType && (
                <p className="mt-1 text-xs font-medium text-red-600">{createErrors.gadgetType}</p>
              )}
              <p className="mt-1 text-xs text-core-400">
                You can type a new gadget name or pick an existing one to add another tier.
              </p>
            </div>

            <Input
              label="Option / Description"
              placeholder="e.g. Standard, With Charger, 50,000mAh, Heavy Duty"
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              helper="Leave as 'Standard' if there is only one price for this gadget."
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-core-700">
                Price (₦ Naira)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-core-400">
                  ₦
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  value={newPrice}
                  onChange={(e) => {
                    setNewPrice(e.target.value);
                    setCreateErrors((er) => ({ ...er, price: undefined }));
                  }}
                  className={`w-full rounded-lg border py-2.5 pl-8 pr-3 text-sm font-semibold text-core-800 focus:outline-none focus:ring-2 focus:ring-core-400 ${
                    createErrors.price ? 'border-red-300 bg-red-50' : 'border-core-200 bg-white'
                  }`}
                />
              </div>
              {createErrors.price && (
                <p className="mt-1 text-xs font-medium text-red-600">{createErrors.price}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddModal(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                loading={creating}
                icon={Plus}
                className="font-semibold shadow-sm"
              >
                Create Gadget Rate
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          open={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          variant="danger"
          loading={deleting}
          title="Delete Gadget Pricing Rate"
          message={`Are you sure you want to delete "${itemToDelete?.gadgetType} (${itemToDelete?.optionLabel})"?`}
          confirmText="Delete Pricing"
          details={
            itemToDelete && (
              <>
                <div className="flex justify-between">
                  <span className="text-core-500">Gadget:</span>
                  <span className="font-semibold text-core-900">{itemToDelete.gadgetType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-core-500">Option:</span>
                  <span className="font-medium text-core-800">{itemToDelete.optionLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-core-500">Current Rate:</span>
                  <span className="font-bold text-core-900">{formatNaira(itemToDelete.price)}</span>
                </div>
              </>
            )
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
