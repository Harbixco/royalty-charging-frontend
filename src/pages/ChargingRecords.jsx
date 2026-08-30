import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, CheckCircle2, Trash2, ChevronLeft, ChevronRight, ListFilter, CreditCard } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Table, THead, Th, Tr, Td } from '../components/ui/Table.jsx';
import StatusBadge, { PaymentBadge } from '../components/charging/StatusBadge.jsx';
import RecordDetailsModal from '../components/charging/RecordDetailsModal.jsx';
import CompleteChargingModal from '../components/charging/CompleteChargingModal.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import { chargingApi } from '../services/api.js';
import { formatNaira } from '../utils/currency.js';
import { formatDateTime } from '../utils/date.js';
import { useToast } from '../context/ToastContext.jsx';
import { GADGET_TYPES, STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../constants/status.js';

const DEBOUNCE_MS = 350;

const ChargingRecords = () => {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [gadgetType, setGadgetType] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);
  const [recordToComplete, setRecordToComplete] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chargingApi.list({
        page,
        limit: 10,
        search: search || undefined,
        gadgetType: gadgetType || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setRecords(res.data.records);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, gadgetType, status, paymentStatus, dateFrom, dateTo]);

  // Debounce search/filter changes, then fetch
  useEffect(() => {
    const t = setTimeout(load, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [load]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [search, gadgetType, status, paymentStatus, dateFrom, dateTo]);

  const handleConfirmComplete = async (completionData) => {
    if (!recordToComplete) return;
    setCompleting(true);
    try {
      const res = await chargingApi.complete(recordToComplete._id, completionData);
      toast.success(`${recordToComplete.customerName} completed — Total: ${formatNaira(res.data.amount)}`);
      setRecordToComplete(null);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleTogglePayment = async (record) => {
    const nextStatus = record.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      await chargingApi.updatePayment(record._id, nextStatus);
      toast.success(`${record.customerName} payment marked as ${nextStatus}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setDeleting(true);
    try {
      await chargingApi.remove(recordToDelete._id);
      toast.success('Charging record deleted successfully');
      setRecordToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setGadgetType('');
    setStatus('');
    setPaymentStatus('');
    setDateFrom('');
    setDateTo('');
  };

  const hasFilters = search || gadgetType || status || paymentStatus || dateFrom || dateTo;

  return (
    <DashboardLayout title="Charging Records">
      <div className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="sm:col-span-2 lg:col-span-2">
              <Input
                label="Search"
                placeholder="Customer name or tag number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              label="Gadget"
              placeholder="All gadgets"
              value={gadgetType}
              onChange={(e) => setGadgetType(e.target.value)}
              options={GADGET_TYPES.map((g) => ({ value: g, label: g }))}
            />
            <Select
              label="Status"
              placeholder="All statuses"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
            <Select
              label="Payment"
              placeholder="All payments"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              options={PAYMENT_STATUS_OPTIONS.map((p) => ({ value: p, label: p }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <Input type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          {hasFilters && (
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </Card>

        {loading && <Spinner label="Loading charging records…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && records.length === 0 && (
          <EmptyState
            icon={ListFilter}
            title="No charging records found"
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first charging record to get started.'}
            action={
              !hasFilters && (
                <Button size="sm" onClick={() => navigate('/new')}>
                  New charging record
                </Button>
              )
            }
          />
        )}

        {!loading && !error && records.length > 0 && (
          <>
            <Table>
              <THead>
                <Th>#</Th>
                <Th>Customer</Th>
                <Th>Tag</Th>
                <Th>Gadget</Th>
                <Th>Option</Th>
                <Th>Amount</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th>Date/Time</Th>
                <Th className="text-right">Actions</Th>
              </THead>
              <tbody>
                {records.map((r, idx) => (
                  <Tr key={r._id}>
                    <Td className="text-core-400">{(pagination.page - 1) * pagination.limit + idx + 1}</Td>
                    <Td className="font-medium text-core-800">
                      <Link to={`/records/${r._id}`} className="hover:text-core-600 hover:underline">
                        {r.customerName}
                      </Link>
                    </Td>
                    <Td className="font-mono text-xs text-core-500">{r.tagNumber}</Td>
                    <Td>{r.gadgetType}</Td>
                    <Td className="text-core-500">{r.option}</Td>
                    <Td>
                      <span className="font-semibold text-core-800">{formatNaira(r.amount)}</span>
                      {r.originalAmount && r.amount < r.originalAmount ? (
                        <span className="ml-1 text-[11px] text-core-400 line-through">
                          {formatNaira(r.originalAmount)}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => handleTogglePayment(r)}
                        title={`Click to mark as ${r.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid'}`}
                        className="transition-transform hover:scale-105"
                      >
                        <PaymentBadge status={r.paymentStatus || 'Unpaid'} />
                      </button>
                    </Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td className="whitespace-nowrap text-core-500">{formatDateTime(r.createdAt)}</Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(r)}
                          title="View details"
                          className="rounded-md p-1.5 text-core-400 hover:bg-core-100 hover:text-core-700"
                        >
                          <Eye size={16} />
                        </button>
                        {r.status !== 'Completed' && (
                          <button
                            onClick={() => setRecordToComplete(r)}
                            title="Complete & verify gadgets"
                            className="rounded-md p-1.5 text-core-400 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setRecordToDelete(r)}
                          title="Delete record"
                          className="rounded-md p-1.5 text-core-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-core-400">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </Button>
                <span className="px-2 text-sm text-core-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Record Details Modal */}
      <RecordDetailsModal
        record={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onComplete={(rec) => {
          setSelected(null);
          setRecordToComplete(rec);
        }}
        onTogglePayment={handleTogglePayment}
        completing={completing}
      />

      {/* Mark As Completed & Gadget Verification Modal */}
      <CompleteChargingModal
        record={recordToComplete}
        open={!!recordToComplete}
        onClose={() => setRecordToComplete(null)}
        onConfirm={handleConfirmComplete}
        loading={completing}
      />

      {/* Delete Record Confirmation Modal */}
      <ConfirmModal
        open={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        loading={deleting}
        title="Delete Charging Record"
        message={`Are you sure you want to permanently delete the charging record for ${recordToDelete?.customerName} (${recordToDelete?.tagNumber})?`}
        confirmText="Delete Record"
        details={
          recordToDelete && (
            <>
              <div className="flex justify-between">
                <span className="text-core-500">Tag Number:</span>
                <span className="font-mono font-bold text-core-900">{recordToDelete.tagNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Gadget(s):</span>
                <span className="font-medium text-core-700">{recordToDelete.gadgetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-core-500">Amount Charged:</span>
                <span className="font-bold text-core-900">{formatNaira(recordToDelete.amount)}</span>
              </div>
              <p className="pt-1 text-red-600 font-semibold">⚠️ This action cannot be reversed.</p>
            </>
          )
        }
      />
    </DashboardLayout>
  );
};

export default ChargingRecords;
