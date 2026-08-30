import React, { useCallback, useEffect, useState } from 'react';
import { Layers, Wallet, Zap, CheckCircle2, CalendarCheck, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import TagSearch from '../components/dashboard/TagSearch.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import StatusBadge from '../components/charging/StatusBadge.jsx';
import { dashboardApi } from '../services/api.js';
import { formatNaira } from '../utils/currency.js';
import { formatDateTime } from '../utils/date.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.stats();
      setStats(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <TagSearch onCompleted={load} />

        {loading && <Spinner label="Loading dashboard stats…" />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Total records" value={stats.totalRecords} icon={Layers} tone="core" />
              <StatCard label="Total revenue" value={formatNaira(stats.totalRevenue)} icon={Wallet} tone="core" />
              <StatCard label="Currently charging" value={stats.activeCharging} icon={Zap} tone="spark" />
              <StatCard label="Received" value={stats.completedRecords} icon={CheckCircle2} tone="success" />
              <StatCard label="Today's revenue" value={formatNaira(stats.todayRevenue)} icon={CalendarCheck} tone="spark" />
              <StatCard label="Today's customers" value={stats.todayRecords} icon={Users} tone="core" />
            </div>

            <Card padded={false}>
              <div className="flex items-center justify-between px-5 py-4 sm:px-6">
                <h2 className="font-display font-semibold text-core-800">Currently charging</h2>
                <Link to="/records" className="text-sm font-medium text-core-600 hover:text-core-800">
                  View all records →
                </Link>
              </div>
              <div className="border-t border-core-100">
                {stats.recentActive?.length ? (
                  <ul className="divide-y divide-core-50">
                    {stats.recentActive.map((r) => (
                      <li key={r._id} className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
                        <div>
                          <p className="text-sm font-medium text-core-800">{r.customerName}</p>
                          <p className="text-xs text-core-400">
                            {r.tagNumber} · {r.gadgetType} · {formatDateTime(r.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-core-700">{formatNaira(r.amount)}</span>
                          <StatusBadge status={r.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-6 sm:px-6">
                    <EmptyState title="Nothing charging right now" description="New charging records will show up here." />
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
