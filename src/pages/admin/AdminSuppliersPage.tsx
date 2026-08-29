import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAdminSuppliersApi, updateAdminSupplierStatusApi } from '../../services/supplierService';
import type { SupplierProfile, SupplierStatus } from '../../types/supplier';

export const AdminSuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | ''>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Status Change Modal
  const [modalSupplier, setModalSupplier] = useState<{ id: number; nextStatus: SupplierStatus } | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getAdminSuppliersApi({
        status: statusFilter || undefined,
        page,
        size: 15
      });
      setSuppliers(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [statusFilter, page]);

  const handleQuickApprove = async (id: number) => {
    setActionLoadingId(id);
    try {
      await updateAdminSupplierStatusApi(id, 'APPROVED', 'Approved by administrator');
      fetchSuppliers();
    } catch (err: any) {
      alert(err.message || 'Failed to approve supplier');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSupplier) return;
    setActionLoadingId(modalSupplier.id);
    try {
      await updateAdminSupplierStatusApi(modalSupplier.id, modalSupplier.nextStatus, statusReason);
      setModalSupplier(null);
      setStatusReason('');
      fetchSuppliers();
    } catch (err: any) {
      alert(err.message || 'Failed to update supplier status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusPills: { label: string; value: SupplierStatus | '' }[] = [
    { label: 'All Suppliers', value: '' },
    { label: 'Pending Review', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white">
            Supplier Network Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Review onboarding applications, verify merchant credentials, and manage supplier authorizations.
          </p>
        </div>
        <Link
          to="/admin/purchase-orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Issue Purchase Order
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => {
              setStatusFilter(pill.value);
              setPage(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === pill.value
                ? 'bg-slate-900 text-white shadow dark:bg-primary-600'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Suppliers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p>Loading supplier records...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <Building2 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No suppliers found</p>
            <p>No supplier profiles match the selected status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Business Entity</th>
                  <th className="py-3.5 px-4 font-semibold">Contact & Email</th>
                  <th className="py-3.5 px-4 font-semibold">Tax ID (GSTIN)</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {suppliers.map((s) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
                    APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                    REJECTED: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
                    SUSPENDED: 'bg-slate-700/20 text-slate-600 border-slate-700/30 dark:text-slate-400',
                  };

                  const isBusy = actionLoadingId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-semibold">
                        <div className="text-slate-900 dark:text-white font-bold">{s.businessName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.city ? `${s.city}, ${s.state}` : s.country}</div>
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{s.name || s.email}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{s.businessEmail}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-800 dark:text-slate-300">
                        {s.taxIdentifier}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        {s.category || 'General'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[s.status] || 'bg-slate-100 text-slate-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === 'PENDING' && (
                            <>
                              <button
                                disabled={isBusy}
                                onClick={() => handleQuickApprove(s.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => setModalSupplier({ id: s.id, nextStatus: 'REJECTED' })}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 text-[11px] font-semibold border border-rose-200 dark:border-rose-500/20 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {s.status === 'APPROVED' && (
                            <>
                              <Link
                                to={`/admin/purchase-orders?supplierId=${s.id}`}
                                className="px-2.5 py-1 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 dark:text-primary-400 text-[11px] font-semibold border border-primary-200 dark:border-primary-500/20 transition-colors"
                              >
                                Issue PO
                              </Link>
                              <button
                                disabled={isBusy}
                                onClick={() => setModalSupplier({ id: s.id, nextStatus: 'SUSPENDED' })}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 text-[11px] font-semibold transition-colors disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            </>
                          )}

                          {s.status === 'SUSPENDED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleQuickApprove(s.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50"
                            >
                              Re-activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {modalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Supplier Status to {modalSupplier.nextStatus}
            </h3>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Reason or notes for this status transition..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalSupplier(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold"
                >
                  Confirm Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
