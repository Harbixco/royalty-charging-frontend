export const STATUS_STYLES = {
  Pending: { bg: 'bg-core-100', text: 'text-core-700', dot: 'bg-core-500' },
  Charging: { bg: 'bg-spark-100', text: 'text-spark-600', dot: 'bg-spark-400' },
  Completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export const PAYMENT_STYLES = {
  Paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Unpaid: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
};

export const STATUS_OPTIONS = ['Pending', 'Charging', 'Completed'];
export const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'Paid'];
export const GADGET_TYPES = ['Phone', 'Desktop', 'Laptop', 'Lamp', 'Power Bank'];
