import React from 'react';
import Badge from '../ui/Badge.jsx';
import { STATUS_STYLES } from '../../constants/status.js';

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
