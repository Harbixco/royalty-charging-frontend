import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-core-200 bg-core-50/40 px-6 py-14 text-center">
    <div className="rounded-full bg-white p-3 shadow-card">
      <Icon size={22} className="text-core-400" />
    </div>
    <div>
      <p className="font-display font-semibold text-core-700">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-core-400">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
