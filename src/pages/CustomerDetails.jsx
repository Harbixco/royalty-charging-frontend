import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import StatusBadge from '../components/charging/StatusBadge.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import { chargingApi } from '../services/api.js';
import { formatNaira } from '../utils/currency.js';
import { formatDateTime } from '../utils/date.js';
import { useToast } from '../context/ToastContext.jsx';

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-core-50 py-3 last:border-0">
    <span className="text-sm text-core-400">{label}</span>
    <span className="text-sm font-medium text-core-800">{value}</span>
  </div>
);

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chargingApi.getById(id);
      setRecord(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirmComplete = async () => {
    setCompleting(true);
    try {
      const res = await chargingApi.updateStatus(id, 'Completed');
      setRecord(res.data);
      setShowCompleteModal(false);
      toast.success('Marked as completed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await chargingApi.remove(id);
      setShowDeleteModal(false);
      toast.success('Charging record deleted');
      navigate('/records');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Customer Details">
      <div className="mx-auto max-w-xl space-y-4">
        <button
          onClick={() => navigate('/records')}
          className="flex items-center gap-1.5 text-sm font-medium text-core-500 hover:text-core-800"
        >
          <ArrowLeft size={16} /> Back to records
        </button>

        {loading && <Spinner label="Loading record…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && record && (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-semibold text-core-800">{record.customerName}</p>
                <p className="text-sm text-core-400">Tag: {record.tagNumber}</p>
              </div>
              <StatusBadge status={record.status} />
            </div>

            <div>
              <Row label="Gadget(s)" value={record.gadgetType} />
              {record.items && record.items.length > 1 ? (
                <div className="border-b border-core-50 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-core-400">Itemized Breakdown</span>
                  <div className="mt-2 space-y-2 rounded-lg bg-core-50 p-3">
                    {record.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-core-700">
                          {it.gadgetType} ({it.option})
                        </span>
                        <span className="font-semibold text-core-900">{formatNaira(it.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Row label="Option / capacity" value={record.option} />
              )}
              <Row label="Total Amount" value={formatNaira(record.amount)} />
              <Row label="Created" value={formatDateTime(record.createdAt)} />
              {record.completedAt && <Row label="Completed" value={formatDateTime(record.completedAt)} />}
              {record.notes && <Row label="Notes" value={record.notes} />}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-2">
              {record.status !== 'Completed' && (
                <Button
                  variant="accent"
                  icon={CheckCircle2}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  onClick={() => setShowCompleteModal(true)}
                >
                  Mark as Completed
                </Button>
              )}
              <Button
                variant="secondary"
                icon={Trash2}
                className="text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Record
              </Button>
            </div>
          </Card>
        )}

        {!loading && !error && record === null && (
          <Card>
            <p className="text-sm text-core-500">
              Record not found. <Link to="/records" className="text-core-700 underline">Back to records</Link>
            </p>
          </Card>
        )}
      </div>

      {/* Mark As Completed Confirmation Modal */}
      {record && (
        <ConfirmModal
          open={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          onConfirm={handleConfirmComplete}
          variant="success"
          loading={completing}
          title="Confirm Handover / Completion"
          message={`Mark charging as completed for ${record.customerName}?`}
          confirmText="Mark as Completed"
          details={
            <>
              <div className="flex justify-between">
                <span className="text-core-500">Tag Number:</span>
                <span className="font-mono font-bold text-core-900">{record.tagNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Gadget:</span>
                <span className="font-medium text-core-800">{record.gadgetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Amount:</span>
                <span className="font-bold text-emerald-700">{formatNaira(record.amount)}</span>
              </div>
            </>
          }
        />
      )}

      {/* Delete Record Confirmation Modal */}
      {record && (
        <ConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          variant="danger"
          loading={deleting}
          title="Delete Charging Record"
          message={`Are you sure you want to permanently delete the charging record for ${record.customerName} (${record.tagNumber})?`}
          confirmText="Delete Record"
          details={
            <>
              <div className="flex justify-between">
                <span className="text-core-500">Tag Number:</span>
                <span className="font-mono font-bold text-core-900">{record.tagNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Amount Charged:</span>
                <span className="font-bold text-core-900">{formatNaira(record.amount)}</span>
              </div>
              <p className="pt-1 text-red-600 font-semibold">⚠️ This action cannot be undone.</p>
            </>
          }
        />
      )}
    </DashboardLayout>
  );
};

export default CustomerDetails;
