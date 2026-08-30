import React, { useEffect, useMemo, useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Plus,
  Trash2,
  Smartphone,
  Laptop,
  Monitor,
  Lightbulb,
  BatteryCharging,
  Plug,
  BatteryMedium,
  Check,
} from 'lucide-react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import { pricingApi, chargingApi } from '../../services/api.js';
import { formatNaira } from '../../utils/currency.js';
import { useToast } from '../../context/ToastContext.jsx';
import { GADGET_TYPES } from '../../constants/status.js';

const GADGET_ICONS = {
  Phone: Smartphone,
  Laptop: Laptop,
  Desktop: Monitor,
  Lamp: Lightbulb,
  'Power Bank': BatteryCharging,
};

const createEmptyItem = () => ({
  id: Math.random().toString(36).substring(2, 9),
  gadgetType: '',
  pricingKey: '',
});

const ChargingForm = ({ onCreated }) => {
  const [pricing, setPricing] = useState([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [items, setItems] = useState([createEmptyItem()]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Load pricing
  const fetchPricing = async () => {
    try {
      setPricingLoading(true);
      const res = await pricingApi.list();
      setPricing((res.data || []).filter((p) => p.active));
    } catch (err) {
      toast.error('Could not load pricing. Please refresh.');
    } finally {
      setPricingLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Map for quick pricing lookup
  const pricingByKey = useMemo(() => {
    return new Map(pricing.map((p) => [p.key, p]));
  }, [pricing]);

  // Dynamically include default gadget types plus any custom ones added by admin
  const allGadgetTypes = useMemo(() => {
    const fromPricing = pricing.map((p) => p.gadgetType);
    return [...new Set([...GADGET_TYPES, ...fromPricing])];
  }, [pricing]);

  // Options available grouped by gadget
  const getOptionsForGadget = (gadgetType) => {
    return pricing.filter((p) => p.gadgetType === gadgetType);
  };

  // Handle gadget change for a specific item
  const handleGadgetChange = (itemId, gadgetType) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const availableOptions = getOptionsForGadget(gadgetType);
        let defaultKey = '';
        if (gadgetType === 'Phone') {
          defaultKey = 'PHONE_WITH_CHARGER';
        } else if (availableOptions.length === 1) {
          defaultKey = availableOptions[0].key;
        } else if (availableOptions.length > 0) {
          defaultKey = availableOptions[0].key;
        }
        return {
          ...item,
          gadgetType,
          pricingKey: defaultKey,
        };
      })
    );
    setErrors((prev) => ({ ...prev, [`gadget_${itemId}`]: undefined, [`option_${itemId}`]: undefined }));
  };

  // Handle option/pricingKey change for a specific item
  const handleOptionChange = (itemId, pricingKey) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, pricingKey } : item))
    );
    setErrors((prev) => ({ ...prev, [`option_${itemId}`]: undefined }));
  };

  // Add another gadget item
  const handleAddItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  // Remove a gadget item
  const handleRemoveItem = (itemId) => {
    setItems((prev) => {
      if (prev.length <= 1) {
        // Reset the single item to empty instead of removing all
        return [createEmptyItem()];
      }
      return prev.filter((item) => item.id !== itemId);
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`gadget_${itemId}`];
      delete next[`option_${itemId}`];
      return next;
    });
  };

  // Calculate total price automatically
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.pricingKey) return sum;
      const priceDoc = pricingByKey.get(item.pricingKey);
      return sum + (priceDoc ? priceDoc.price : 0);
    }, 0);
  }, [items, pricingByKey]);

  // Valid item count
  const validItemsCount = useMemo(() => {
    return items.filter((i) => i.gadgetType && i.pricingKey).length;
  }, [items]);

  const validate = () => {
    const next = {};
    if (!customerName.trim()) next.customerName = 'Customer name is required';
    if (!tagNumber.trim()) next.tagNumber = 'Tag number is required';

    let hasValidGadget = false;
    items.forEach((item, index) => {
      if (!item.gadgetType) {
        next[`gadget_${item.id}`] = `Select gadget for item #${index + 1}`;
      } else if (!item.pricingKey) {
        next[`option_${item.id}`] = `Select an option for ${item.gadgetType}`;
      } else {
        hasValidGadget = true;
      }
    });

    if (!hasValidGadget && Object.keys(next).length === 0) {
      next.general = 'Please select at least one gadget';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payloadItems = items
        .filter((item) => item.gadgetType && item.pricingKey)
        .map((item) => ({
          pricingKey: item.pricingKey,
          gadgetType: item.gadgetType,
        }));

      const res = await chargingApi.create({
        customerName: customerName.trim(),
        tagNumber: tagNumber.trim(),
        paymentStatus,
        items: payloadItems,
        notes: notes.trim() || undefined,
      });

      toast.success(`Record created for ${res.data.customerName} — ${formatNaira(res.data.amount)} (${paymentStatus})`);
      
      // Reset form
      setCustomerName('');
      setTagNumber('');
      setPaymentStatus('Unpaid');
      setItems([createEmptyItem()]);
      setNotes('');
      setErrors({});

      onCreated?.(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Customer & Tag Number */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Customer Name"
            name="customerName"
            placeholder="e.g. Aisha Bello"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setErrors((er) => ({ ...er, customerName: undefined }));
            }}
            error={errors.customerName}
          />

          <Input
            label="Tag Number"
            name="tagNumber"
            placeholder="e.g. 001, ROY-025, A-12"
            value={tagNumber}
            onChange={(e) => {
              setTagNumber(e.target.value.toUpperCase());
              setErrors((er) => ({ ...er, tagNumber: undefined }));
            }}
            error={errors.tagNumber}
          />
        </div>

        {/* Payment Status Selector */}
        <div className="rounded-xl border border-core-200 bg-core-50/50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-core-800">Payment Status at Drop-off</p>
              <p className="text-xs text-core-500">Has the customer paid upfront or will they pay upon collection?</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaymentStatus('Unpaid')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  paymentStatus === 'Unpaid'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-core-700 border-core-200 hover:bg-core-100'
                }`}
              >
                Unpaid (Pay on collection)
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('Paid')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  paymentStatus === 'Paid'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-core-700 border-core-200 hover:bg-core-100'
                }`}
              >
                Paid on arrival
              </button>
            </div>
          </div>
        </div>

        {/* Gadgets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-core-100 pb-2">
            <div>
              <h3 className="font-display text-base font-semibold text-core-800">Gadgets to Charge</h3>
              <p className="text-xs text-core-500">Select devices and options — total price updates automatically</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAddItem}
            >
              Add another gadget
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const gadgetOptions = getOptionsForGadget(item.gadgetType);
              const selectedPriceObj = pricingByKey.get(item.pricingKey);

              return (
                <div
                  key={item.id}
                  className="relative rounded-xl border border-core-200 bg-white p-4.5 shadow-sm transition-all hover:border-core-300"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-core-500">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-core-100 text-core-700 text-[11px]">
                        {index + 1}
                      </span>
                      Gadget #{index + 1}
                    </span>

                    {/* Working Remove Option / Gadget Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                      title="Remove this gadget"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Gadget Type Selector Buttons */}
                  <div className="mb-3">
                    <label className="mb-1.5 block text-xs font-semibold text-core-700">Select Gadget Type</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                      {allGadgetTypes.map((g) => {
                        const Icon = GADGET_ICONS[g] || Zap;
                        const isSelected = item.gadgetType === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGadgetChange(item.id, g)}
                            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-core-800 bg-core-800 text-white shadow-sm ring-2 ring-core-400'
                                : 'border-core-200 bg-white text-core-700 hover:border-core-300 hover:bg-core-50'
                            }`}
                          >
                            <Icon size={18} className={isSelected ? 'text-spark-300' : 'text-core-500'} />
                            <span className="truncate max-w-[90px]">{g}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors[`gadget_${item.id}`] && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{errors[`gadget_${item.id}`]}</p>
                    )}
                  </div>

                  {/* Options specific to Phone */}
                  {item.gadgetType === 'Phone' && (
                    <div className="mt-3 rounded-lg border border-core-100 bg-core-50/70 p-3">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-core-600">
                        Phone Charging Option (Indicate Charger):
                      </label>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {gadgetOptions.map((opt) => {
                          const isSelected = item.pricingKey === opt.key;
                          const isWithCharger = opt.key === 'PHONE_WITH_CHARGER';
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleOptionChange(item.id, opt.key)}
                              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-sm'
                                  : 'border-core-200 bg-white hover:border-core-300 hover:bg-core-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isSelected ? 'bg-emerald-600 text-white' : 'bg-core-100 text-core-600'
                                  }`}
                                >
                                  {isWithCharger ? <Plug size={16} /> : <Zap size={16} />}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-core-800">
                                    {opt.optionLabel || (isWithCharger ? 'With Charger' : 'Without Charger')}
                                  </p>
                                  <p className="text-xs text-core-500">
                                    {isWithCharger ? 'Customer brought charger' : 'Using shop charger'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-display text-sm font-bold text-core-900">
                                  {formatNaira(opt.price)}
                                </span>
                                {isSelected && (
                                  <div className="flex justify-end text-emerald-600">
                                    <Check size={16} />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors[`option_${item.id}`] && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">{errors[`option_${item.id}`]}</p>
                      )}
                    </div>
                  )}

                  {/* Options for other multi-option gadgets (e.g. Power Bank or custom gadgets with >1 option) */}
                  {item.gadgetType && item.gadgetType !== 'Phone' && gadgetOptions.length > 1 && (
                    <div className="mt-3 rounded-lg border border-core-100 bg-core-50/70 p-3">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-core-600">
                        {item.gadgetType} Option / Capacity:
                      </label>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {gadgetOptions.map((opt) => {
                          const isSelected = item.pricingKey === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleOptionChange(item.id, opt.key)}
                              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-sm'
                                  : 'border-core-200 bg-white hover:border-core-300 hover:bg-core-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isSelected ? 'bg-emerald-600 text-white' : 'bg-core-100 text-core-600'
                                  }`}
                                >
                                  <Zap size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-core-800">{opt.optionLabel}</p>
                                  <p className="text-xs text-core-500">Charging session</p>
                                </div>
                              </div>
                              <span className="font-display text-sm font-bold text-core-900">
                                {formatNaira(opt.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Single-option gadget rate banner */}
                  {item.gadgetType && item.gadgetType !== 'Phone' && gadgetOptions.length === 1 && selectedPriceObj && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-core-50 px-3.5 py-2.5 text-xs">
                      <span className="text-core-600">
                        Rate for <strong>{item.gadgetType}</strong> ({selectedPriceObj.optionLabel}):
                      </span>
                      <span className="font-display font-bold text-sm text-core-900">
                        {formatNaira(selectedPriceObj.price)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-core-700">Notes (Optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Color of phone, device brand, special instructions"
            className="w-full rounded-lg border border-core-200 px-3.5 py-2.5 text-sm text-core-800 placeholder:text-core-400 focus:outline-none focus:ring-2 focus:ring-core-400"
          />
        </div>

        {/* Automatic Real-Time Money Calculation & Submission Bar */}
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl bg-core-900 p-5 text-white sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-spark-400 text-core-950 font-bold shadow-sm">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-core-300">
                Total Calculated Amount ({validItemsCount} {validItemsCount === 1 ? 'gadget' : 'gadgets'})
              </p>
              <p className="font-display text-3xl font-bold tracking-tight text-white">
                {formatNaira(totalAmount)}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            icon={CheckCircle2}
            loading={submitting}
            className="w-full sm:w-auto font-semibold shadow-md"
          >
            Create Charging Record
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChargingForm;
