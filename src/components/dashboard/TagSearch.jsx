import React, { useState } from 'react';
import { Search, CheckCircle2, Zap } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';
import { chargingApi } from '../../services/api.js';
import { formatNaira } from '../../utils/currency.js';
import { formatDateTime } from '../../utils/date.js';
import { useToast } from '../../context/ToastContext.jsx';
import { STATUS_STYLES } from '../../constants/status.js';

// The prominent "Find Customer by Tag Number" widget — the fastest path
// from a tag number to a completed handover, front and center on the dashboard.
const TagSearch = ({ onCompleted }) => {
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!tag.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await chargingApi.lookupByTag(tag.trim());
      setResult(res.data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplete = async () => {
    if (!result) return;
    setCompleting(true);
    try {
      const res = await chargingApi.updateStatus(result._id, 'Completed');
      setResult(res.data);
      setShowConfirm(false);
      toast.success(`${result.customerName}'s ${result.gadgetType.toLowerCase()} marked as completed`);
      onCompleted?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const style = result ? STATUS_STYLES[result.status] : null;

  return (
    <div className="rounded-2xl border border-core-700 bg-core-800 p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2 text-spark-400">
        <Zap size={16} />
        <p className="text-sm font-semibold uppercase tracking-wide">Find customer by tag number</p>
      </div>
      <p className="mt-1 text-sm text-core-300">
        For the collection point — search a tag, confirm the gadget, mark it complete.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-core-400" />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. ROY-025"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-core-400 focus:outline-none focus:ring-2 focus:ring-spark-400"
          />
        </div>
        <Button type="submit" variant="accent" loading={loading}>
          Search
        </Button>
      </form>

      {notFound && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
          No record found for that tag number. Check the spelling and try again.
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-white">{result.customerName}</p>
              <p className="text-sm text-core-300">
                {result.gadgetType} · {result.option}
              </p>
            </div>
            <Badge className={`${style.bg} ${style.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {result.status}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-core-300">
            <span className="font-semibold text-spark-400">{formatNaira(result.amount)}</span>
            <span>Tag: {result.tagNumber}</span>
            <span>{formatDateTime(result.createdAt)}</span>
          </div>
          {result.status !== 'Completed' ? (
            <Button
              variant="accent"
              size="sm"
              icon={CheckCircle2}
              className="mt-4 w-full sm:w-auto font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowConfirm(true)}
            >
              Mark as Completed
            </Button>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              <CheckCircle2 size={16} /> Already collected
            </p>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {result && (
        <ConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmComplete}
          variant="success"
          loading={completing}
          title="Confirm Handover / Completion"
          message={`Are you sure you want to mark charging as completed for ${result.customerName}?`}
          confirmText="Mark as Completed"
          details={
            <>
              <div className="flex justify-between">
                <span className="text-core-500">Tag Number:</span>
                <span className="font-mono font-bold text-core-900">{result.tagNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Gadget:</span>
                <span className="font-medium text-core-800">{result.gadgetType} ({result.option})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Amount:</span>
                <span className="font-bold text-emerald-700">{formatNaira(result.amount)}</span>
              </div>
            </>
          }
        />
      )}
    </div>
  );
};

export default TagSearch;
