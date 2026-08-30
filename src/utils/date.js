export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const toInputDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};
