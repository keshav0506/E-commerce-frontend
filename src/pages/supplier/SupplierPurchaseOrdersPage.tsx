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
import { peekApiCache } from '../../services/api';
import type { PurchaseOrder, PurchaseOrderStatus } from '../../types/supplier';

export const SupplierPurchaseOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') as PurchaseOrderStatus | null;

  const cachedPOs = peekApiCache<any>('/supplier/purchase-orders?page=0&size=10') || peekApiCache<any>('/supplier/purchase-orders');
  const [orders, setOrders] = useState<PurchaseOrder[]>(cachedPOs?.content || []);
  const [loading, setLoading] = useState(!cachedPOs);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PurchaseOrderStatus | ''>(initialStatus || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(cachedPOs?.totalPages || 1);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Modals for Reject & Ship
  const [rejectModalId, setRejectModalId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [shipModalId, setShipModalId] = useState<number | null>(null);
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground && orders.length === 0) setLoading(true);
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
      if (orders.length === 0) {
        setError(err.message || 'Failed to fetch purchase orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(orders.length > 0 && page === 0 && !search && !selectedStatus);
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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <ClipboardList className="w-7 h-7 text-rose-500" />
          <span>Purchase Orders</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review, accept, pack, and fulfill purchase orders assigned to your supplier profile.
        </p>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between text-xs text-rose-600 font-bold">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-rose-500 font-bold ml-4 cursor-pointer">✕</button>
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
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === s.value
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-[#f3f4f6] text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200/80 shadow-2xs'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO # or Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-2xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-bold">Loading purchase orders...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
            <p>{error}</p>
            <button onClick={() => fetchOrders()} className="px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-rose-600 font-bold cursor-pointer">Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs space-y-2">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-900">No purchase orders found</p>
            <p>No procurement requests match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">PO Number</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Products & Items</th>
                  <th className="py-3.5 px-5">Expected By</th>
                  <th className="py-3.5 px-5">Total Amount</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((po) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
                    ACCEPTED: 'bg-blue-50 text-blue-600 border-blue-100',
                    PROCESSING: 'bg-cyan-50 text-cyan-600 border-cyan-100',
                    SHIPPED: 'bg-purple-50 text-purple-600 border-purple-100',
                    IN_TRANSIT: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                    DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    REJECTED: 'bg-rose-50 text-rose-600 border-rose-100',
                    CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
                  };

                  const isBusy = actionLoadingId === po.id;

                  return (
                    <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-gray-900">
                        <Link to={`/supplier/purchase-orders/${po.id}`} className="hover:text-rose-600 transition-colors">
                          {po.poNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-gray-500">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-bold text-gray-900 truncate">
                          {po.items && po.items.length > 0 ? po.items[0].productName : 'Procurement Batch'}
                        </div>
                        {po.items && po.items.length > 1 && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            +{po.items.length - 1} additional product(s)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-gray-500 font-medium">
                        {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-5 font-black text-gray-900">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[po.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Workflow Step Actions */}
                          {po.status === 'PENDING' && (
                            <>
                              <button
                                disabled={isBusy}
                                onClick={() => handleAccept(po.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] transition-all shadow-sm shadow-rose-500/20 disabled:opacity-50 cursor-pointer"
                              >
                                {isBusy ? '...' : 'Accept'}
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => setRejectModalId(po.id)}
                                className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-[11px] font-bold border border-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {po.status === 'ACCEPTED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleProcess(po.id)}
                              className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Package className="w-3 h-3" />
                              Start Packing
                            </button>
                          )}

                          {po.status === 'PROCESSING' && (
                            <button
                              disabled={isBusy}
                              onClick={() => setShipModalId(po.id)}
                              className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3 h-3" />
                              Ship Order
                            </button>
                          )}

                          {po.status === 'SHIPPED' && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleDeliver(po.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Mark Delivered
                            </button>
                          )}

                          <Link
                            to={`/supplier/purchase-orders/${po.id}`}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200 transition-colors"
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
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">Page {page + 1} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-40 border border-gray-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-40 border border-gray-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-gray-900">Decline Purchase Order</h3>
            <p className="text-xs text-gray-500">
              Please state why you are declining this order. The administrative team will be notified immediately.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="e.g. Stock temporarily unavailable or lead time insufficient..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setRejectModalId(null); setRejectionReason(''); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 space-y-4 text-left shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-gray-900">Dispatch Shipment</h3>
            <p className="text-xs text-gray-500">
              Enter the logistics carrier and tracking AWB number for this consignment batch.
            </p>
            <form onSubmit={handleShipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Carrier / Freight Partner</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Freight">Delhivery Freight</option>
                  <option value="DTDC Surface">DTDC Surface</option>
                  <option value="FedEx Logistics">FedEx Logistics</option>
                  <option value="Direct Supplier Fleet">Direct Supplier Fleet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tracking Number / AWB</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BLU-84920489"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShipModalId(null); setTrackingNumber(''); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 cursor-pointer"
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
