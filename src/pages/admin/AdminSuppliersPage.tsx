import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store
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
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER BANNER */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Vendor Management
            </span>
            <span className="text-xs text-gray-400 font-semibold">• B2B Merchant Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Supplier Network Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review onboarding applications, verify merchant credentials, and manage category supplier authorizations.
          </p>
        </div>
        <Link
          to="/admin/purchase-orders"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white text-xs font-extrabold shadow-md shadow-rose-200 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Issue Purchase Order</span>
        </Link>
      </div>

      {/* FILTER TABS */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-2.5 shadow-xs flex items-center gap-2 overflow-x-auto">
        {statusPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => {
              setStatusFilter(pill.value);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === pill.value
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/80 shadow-2xs hover:bg-gray-50'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* SUPPLIERS TABLE */}
      <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-bold">Loading supplier records...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-16 text-center text-gray-500 text-xs space-y-2">
            <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
              <Building2 className="w-8 h-8 text-rose-500" />
            </div>
            <p className="font-extrabold text-gray-900 text-sm">No suppliers found</p>
            <p className="text-gray-400">No supplier profiles currently match the selected status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f3f4f6] text-gray-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Business Entity</th>
                  <th className="py-3.5 px-4 font-bold">Contact & Email</th>
                  <th className="py-3.5 px-4 font-bold">Tax ID (GSTIN)</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {suppliers.map((s) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
                    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
                    SUSPENDED: 'bg-gray-100 text-gray-700 border-gray-200',
                  };

                  const isBusy = actionLoadingId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] border border-gray-200/80 flex items-center justify-center text-rose-500 shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <Link
                              to={`/supplier-store/${s.id}`}
                              className="text-gray-900 font-extrabold hover:text-rose-600 transition-colors flex items-center gap-1"
                              title="Preview Public Storefront"
                            >
                              <span>{s.businessName}</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </Link>
                            <div className="text-[11px] text-gray-400">{s.city ? `${s.city}, ${s.state}` : s.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-gray-900 font-medium">{s.name || s.email}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{s.businessEmail}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-gray-800">
                        {s.taxIdentifier}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        <span className="inline-block px-2.5 py-0.5 bg-gray-100 rounded-lg text-[10px] font-extrabold uppercase">
                          {s.category || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusColors[s.status] || 'bg-gray-100 text-gray-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === 'PENDING' && (
                            <>
                              <button
                                disabled={isBusy}
                                onClick={() => handleQuickApprove(s.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => setModalSupplier({ id: s.id, nextStatus: 'REJECTED' })}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 disabled:opacity-50 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {s.status === 'APPROVED' && (
                            <>
                              <Link
                                to={`/supplier-store/${s.id}`}
                                className="px-3 py-1.5 rounded-xl bg-[#f3f4f6] hover:bg-rose-50 border border-gray-200/80 hover:border-rose-200 text-gray-800 hover:text-rose-600 text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                              >
                                <Store className="w-3.5 h-3.5" />
                                <span>Store</span>
                              </Link>
                              <Link
                                to={`/admin/purchase-orders?supplierId=${s.id}`}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors shadow-2xs"
                              >
                                Issue PO
                              </Link>
                              <button
                                disabled={isBusy}
                                onClick={() => setModalSupplier({ id: s.id, nextStatus: 'SUSPENDED' })}
                                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Suspend
                              </button>
                            </>
                          )}

                          {s.status === 'SUSPENDED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleQuickApprove(s.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
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
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between text-xs text-gray-600 font-semibold">
            <span>Page <strong className="text-gray-900">{page + 1}</strong> of <strong className="text-gray-900">{totalPages}</strong></span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-2 rounded-xl border border-gray-200/80 hover:bg-gray-50 text-gray-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-xl border border-gray-200/80 hover:bg-gray-50 text-gray-700 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {modalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 space-y-4 text-left shadow-2xl">
            <h3 className="text-base font-extrabold text-gray-900">
              Update Supplier Status to {modalSupplier.nextStatus}
            </h3>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Reason or notes for this status transition..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-3.5 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSupplier(null)}
                  className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer"
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
