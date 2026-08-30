import React from 'react';
import { Building2, Bell, Shield } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <Card>
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-lg bg-core-100 p-2 text-core-700">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="font-display font-semibold text-core-800">{title}</h2>
        <p className="text-sm text-core-400">{description}</p>
      </div>
    </div>
    {children}
  </Card>
);

// Settings is presentational for now — business details are used
// throughout the app copy, notifications and access control are
// natural next additions once the app has real multi-user auth.
const Settings = () => (
  <DashboardLayout title="Settings">
    <div className="mx-auto max-w-2xl space-y-5">
      <SettingSection icon={Building2} title="Business details" description="Shown on printed receipts and reports.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Business name" defaultValue="Royalty Charging" />
          <Input label="Contact phone" placeholder="e.g. 0803 000 0000" />
          <div className="sm:col-span-2">
            <Input label="Address" placeholder="Shop address" />
          </div>
        </div>
        <Button className="mt-4" size="sm">Save changes</Button>
      </SettingSection>

      <SettingSection icon={Bell} title="Notifications" description="Choose what staff get notified about.">
        <label className="flex items-center justify-between rounded-lg border border-core-100 px-4 py-3">
          <span className="text-sm text-core-700">New charging record created</span>
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-core-700" />
        </label>
      </SettingSection>

      <SettingSection icon={Shield} title="Access" description="Manage who can edit pricing and delete records.">
        <p className="text-sm text-core-400">
          Multi-user roles and permissions are not enabled yet — every staff member currently has full access.
        </p>
      </SettingSection>
    </div>
  </DashboardLayout>
);

export default Settings;
