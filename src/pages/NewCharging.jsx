import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ChargingForm from '../components/charging/ChargingForm.jsx';

const NewCharging = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="New Charging">
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-core-500">
          Enter the customer's details, select the gadget and option — the amount is calculated
          automatically so staff never have to type a price.
        </p>
        <ChargingForm onCreated={() => navigate('/records')} />
      </div>
    </DashboardLayout>
  );
};

export default NewCharging;
