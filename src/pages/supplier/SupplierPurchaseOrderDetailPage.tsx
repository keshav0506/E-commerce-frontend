import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  getSupplierPurchaseOrderByIdApi,
  acceptPurchaseOrderApi,
  rejectPurchaseOrderApi,
  processPurchaseOrderApi,
  shipPurchaseOrderApi,
  deliverPurchaseOrderApi
} from '../../services/supplierService';
import type { PurchaseOrder } from '../../types/supplier';

export const SupplierPurchaseOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals for Reject & Ship
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showShipModal, setShowShipModal] = useState(false);
  const [carrier, setCarrier] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSupplierPurchaseOrderByIdApi(id);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load purchase order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleAccept = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const updated = await acceptPurchaseOrderApi(order.id, 'Accepted by supplier');
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to accept purchase order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const updated = await rejectPurchaseOrderApi(order.id, rejectionReason);
      setOrder(updated);
      setShowRejectModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to reject purchase order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const updated = await processPurchaseOrderApi(order.id, 'Packaging started');
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to process purchase order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !trackingNumber.trim()) return;
    setActionLoading(true);
    try {
      const updated = await shipPurchaseOrderApi(order.id, { carrier, trackingNumber });
      setOrder(updated);
      setShowShipModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to ship purchase order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const updated = await deliverPurchaseOrderApi(order.id, 'Delivered and acknowledged');
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to complete delivery');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p>Loading purchase order record...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Purchase Order Not Found</h3>
        <p className="text-xs text-rose-300 leading-relaxed">{error || 'Record is inaccessible or does not exist.'}</p>
        <Link
          to="/supplier/purchase-orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to List
        </Link>
      </div>
    );
  }

  const steps = ['PENDING', 'ACCEPTED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = steps.indexOf(order.status);

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/supplier/purchase-orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Purchase Orders
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Order PO
          </button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Header Information */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                {order.poNumber}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Issued: {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {order.status === 'PENDING' && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  Accept PO
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-all disabled:opacity-50"
                >
                  Decline
                </button>
              </>
            )}

            {order.status === 'ACCEPTED' && (
              <button
                disabled={actionLoading}
                onClick={handleProcess}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Package className="w-4 h-4" />
                Start Packing & Processing
              </button>
            )}

            {order.status === 'PROCESSING' && (
              <button
                disabled={actionLoading}
                onClick={() => setShowShipModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                Mark as Dispatched / Shipped
              </button>
            )}

            {order.status === 'SHIPPED' && (
              <button
                disabled={actionLoading}
                onClick={handleDeliver}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Warehouse Delivery
              </button>
            )}
          </div>
        </div>

        {/* Timeline Progression Bar */}
        {order.status !== 'REJECTED' && order.status !== 'CANCELLED' && (
          <div className="py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Fulfillment Progression
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-semibold uppercase ${isCurrent ? 'text-emerald-400' : isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rejection / Note Callout */}
        {order.rejectionReason && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
            <p className="text-xs font-bold text-rose-400">Order Declined Reason</p>
            <p className="text-xs text-rose-300">{order.rejectionReason}</p>
          </div>
        )}

        {order.shippingCarrier && order.trackingNumber && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-purple-300">Carrier: {order.shippingCarrier}</p>
              <p className="text-purple-400 font-mono mt-0.5">Tracking Number: {order.trackingNumber}</p>
            </div>
            <Truck className="w-6 h-6 text-purple-400" />
          </div>
        )}

        {/* Itemised Procurement Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Order Items & SKUs
          </h3>
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Unit Wholesale Price</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white">{item.productName}</p>
                          {item.productSku && (
                            <p className="text-[10px] font-mono text-slate-400">SKU: {item.productSku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      {item.quantity} units
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      ₹{Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      ₹{Number(item.subtotal).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950/80 font-bold border-t border-slate-800">
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-right text-slate-400">Total Procurement Payable:</td>
                  <td className="py-4 px-4 text-right text-base text-emerald-400 font-mono">
                    ₹{Number(order.totalAmount).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Decline Purchase Order</h3>
            <form onSubmit={handleReject} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="State your reason for declining this order..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
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
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Dispatch Shipment</h3>
            <form onSubmit={handleShip} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Carrier Partner</label>
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
                  onClick={() => setShowShipModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
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
