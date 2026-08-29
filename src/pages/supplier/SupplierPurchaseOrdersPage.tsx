import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  CheckCircle,
  Package,
  Truck,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import {
  getSupplierPurchaseOrdersApi,
  acceptPurchaseOrderApi,
  rejectPurchaseOrderApi,
  processPurchaseOrderApi,
  shipPurchaseOrderApi,
  deliverPurchaseOrderApi
} from '../../services/supplierService';
import type { PurchaseOrder, PurchaseOrderStatus } from '../../types/supplier';

export const SupplierPurchaseOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') as PurchaseOrderStatus | null;

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PurchaseOrderStatus | ''>(initialStatus || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Modals for Reject & Ship
  const [rejectModalId, setRejectModalId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [shipModalId, setShipModalId] = useState<number | null>(null);
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSupplierPurchaseOrdersApi({
        status: selectedStatus || undefined,
        search: search.trim() || undefined,
        page,
        size: 10
      });
      setOrders(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchOrders();
  };

  const handleStatusChange = (status: PurchaseOrderStatus | '') => {
    setSelectedStatus(status);
    setPage(0);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleAccept = async (id: number) => {
    setActionLoadingId(id);
    try {
      await acceptPurchaseOrderApi(id, 'Accepted by supplier');
      setActionSuccessMsg('Purchase order accepted successfully.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to accept purchase order');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalId || !rejectionReason.trim()) return;
    setActionLoadingId(rejectModalId);
    try {
      await rejectPurchaseOrderApi(rejectModalId, rejectionReason);
      setRejectModalId(null);
      setRejectionReason('');
      setActionSuccessMsg('Purchase order declined.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to reject purchase order');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleProcess = async (id: number) => {
    setActionLoadingId(id);
    try {
      await processPurchaseOrderApi(id, 'Order packing in progress');
      setActionSuccessMsg('Order moved to processing/packing.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to process order');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipModalId || !trackingNumber.trim()) return;
    setActionLoadingId(shipModalId);
    try {
      await shipPurchaseOrderApi(shipModalId, { carrier, trackingNumber });
      setShipModalId(null);
      setTrackingNumber('');
      setActionSuccessMsg('Order marked as shipped with tracking details.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update shipment');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeliver = async (id: number) => {
    setActionLoadingId(id);
    try {
      await deliverPurchaseOrderApi(id, 'Shipment delivered to fulfillment facility');
      setActionSuccessMsg('Order marked as Delivered & inventory updated.');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to mark delivered');
    } finally {
      setActionLoadingId(null);
    }
  };

  const statuses: { label: string; value: PurchaseOrderStatus | '' }[] = [
    { label: 'All Orders', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Purchase Orders</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, accept, pack, and fulfill purchase orders assigned to your supplier profile.
        </p>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === s.value
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO # or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Orders Table Container */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p>Loading purchase orders...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-400 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
            <p>{error}</p>
            <button onClick={fetchOrders} className="px-3 py-1 bg-slate-800 rounded-lg text-white font-semibold">Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs space-y-2">
            <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No purchase orders found</p>
            <p>No procurement requests match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">PO Number</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Products & Items</th>
                  <th className="py-3.5 px-4 font-semibold">Expected By</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {orders.map((po) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    ACCEPTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    PROCESSING: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                    SHIPPED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    IN_TRANSIT: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                    DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    CANCELLED: 'bg-slate-700/20 text-slate-400 border-slate-700/30',
                  };

                  const isBusy = actionLoadingId === po.id;

                  return (
                    <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <Link to={`/supplier/purchase-orders/${po.id}`} className="hover:text-emerald-400 transition-colors">
                          {po.poNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate">
                          {po.items && po.items.length > 0 ? po.items[0].productName : 'Procurement Batch'}
                        </div>
                        {po.items && po.items.length > 1 && (
                          <span className="text-[10px] text-slate-400">
                            +{po.items.length - 1} additional product(s)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[po.status] || 'bg-slate-800 text-slate-300'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Workflow Step Actions */}
                          {po.status === 'PENDING' && (
                            <>
                              <button
                                disabled={isBusy}
                                onClick={() => handleAccept(po.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50"
                              >
                                {isBusy ? '...' : 'Accept'}
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => setRejectModalId(po.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-semibold border border-rose-500/20 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {po.status === 'ACCEPTED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleProcess(po.id)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              <Package className="w-3 h-3" />
                              Start Packing
                            </button>
                          )}

                          {po.status === 'PROCESSING' && (
                            <button
                              disabled={isBusy}
                              onClick={() => setShipModalId(po.id)}
                              className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" />
                              Ship Order
                            </button>
                          )}

                          {po.status === 'SHIPPED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleDeliver(po.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Mark Delivered
                            </button>
                          )}

                          <Link
                            to={`/supplier/purchase-orders/${po.id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View PO Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Decline Purchase Order</h3>
            <p className="text-xs text-slate-400">
              Please state why you are declining this order. The administrative team will be notified immediately.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="e.g. Stock temporarily unavailable or lead time insufficient..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setRejectModalId(null); setRejectionReason(''); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ship Modal */}
      {shipModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Dispatch Shipment</h3>
            <p className="text-xs text-slate-400">
              Enter the logistics carrier and tracking AWB number for this consignment batch.
            </p>
            <form onSubmit={handleShipSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Carrier / Freight Partner</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Freight">Delhivery Freight</option>
                  <option value="DTDC Surface">DTDC Surface</option>
                  <option value="FedEx Logistics">FedEx Logistics</option>
                  <option value="Direct Supplier Fleet">Direct Supplier Fleet</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BLU-84920489"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShipModalId(null); setTrackingNumber(''); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold"
                >
                  Confirm Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
