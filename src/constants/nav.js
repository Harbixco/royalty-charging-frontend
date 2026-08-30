import { LayoutDashboard, PlusCircle, ListChecks, Tag } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'New Charging', to: '/new', icon: PlusCircle },
  { label: 'Charging Records', to: '/records', icon: ListChecks },
  { label: 'Pricing', to: '/pricing', icon: Tag },
];

