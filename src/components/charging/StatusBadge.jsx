import React from 'react';
import Badge from '../ui/Badge.jsx';
import { STATUS_STYLES, PAYMENT_STYLES } from '../../constants/status.js';

export const PaymentBadge = ({ status = 'Unpaid', className = '' }) => {
  const style = PAYMENT_STYLES[status] || PAYMENT_STYLES.Unpaid;
  return (
    <Badge className={`${style.bg} ${style.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </Badge>
  );
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <Badge className={`${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </Badge>
  );
};

export default StatusBadge;
