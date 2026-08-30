/**
 * Formats a number as Nigerian Naira, e.g. 1500 -> "₦1,500".
 */
export const formatNaira = (amount) => {
  const value = Number(amount) || 0;
  return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
};
