import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
  User,
  MapPin,
  CreditCard,
  AlertTriangle,
  X,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { OrderStatus } from '../../types';

export const AdminOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus, cancelOrder } = useShop();

  const decodedId = id ? decodeURIComponent(id) : '';
  const order = orders.find((o) => o.id === decodedId || o.id.replace('#', '') === decodedId.replace('#', ''));

  // Modals state
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<OrderStatus>('Processing');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="bg-[#f3f4f6] rounded-3xl p-10 max-w-md w-full border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Order Not Found</h2>
          <p className="text-xs text-gray-500">
            The order you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  // Handle Update Status submit
  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    setTimeout(() => {
      const success = updateOrderStatus(order.id, selectedNextStatus);
      setIsUpdating(false);
      if (success) {
        setIsUpdateStatusModalOpen(false);
      }
    }, 500);
  };

  // Handle Cancel Order submit
  const handleConfirmCancel = () => {
    setIsUpdating(true);
    setTimeout(() => {
      cancelOrder(order.id);
      setIsUpdating(false);
      setIsCancelModalOpen(false);
    }, 500);
  };

  // Helper for status badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'Confirmed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><PackageCheck className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
    }
  };

  // Timeline Steps Calculation
  const timelineSteps = [
    { label: 'Order Placed', time: order.createdAt, done: true },
    { label: 'Confirmed', time: order.status !== 'Pending' ? 'Aug 10, 10:35 AM' : '', done: ['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(order.status) },
    { label: 'Processing', time: ['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'Aug 10, 12:10 PM' : '', done: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
    { label: 'Shipped', time: ['Shipped', 'Delivered'].includes(order.status) ? 'Aug 10, 04:30 PM' : '', done: ['Shipped', 'Delivered'].includes(order.status) },
    { label: 'Delivered', time: order.status === 'Delivered' ? (order.updatedAt || 'Aug 10, 06:00 PM') : '', done: order.status === 'Delivered' }
  ];

  const isCancellable = ['Pending', 'Confirmed', 'Processing'].includes(order.status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-2">
        <Link to="/admin" className="hover:text-rose-600">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/admin/orders" className="hover:text-rose-600">Orders</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-extrabold font-mono">{order.id}</span>
      </nav>

      {/* HEADER WITH ACTIONS */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
                {order.id}
              </h1>
              {renderStatusBadge(order.status)}
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment: {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed on <strong className="text-gray-800">{order.createdAt}</strong> • Last updated: {order.updatedAt || order.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedNextStatus(order.status);
                setIsUpdateStatusModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-extrabold rounded-2xl shadow-sm transition-colors cursor-pointer"
            >
              Update Status
            </button>

            {isCancellable && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold rounded-2xl border border-rose-200 transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ORDER ITEMS, SUMMARY & TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ORDER ITEMS TABLE */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Ordered Products ({order.items.length})
            </h3>

            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3 truncate">
                    <img src={item.image} alt={item.productName} className="w-14 h-14 object-contain bg-[#f3f4f6] rounded-xl p-1.5 border border-gray-200/80 shrink-0" />
                    <div className="truncate">
                      <h4 className="font-bold text-gray-900 text-xs truncate max-w-xs">{item.productName}</h4>
                      <span className="text-[11px] text-gray-400 font-mono block mt-0.5">{item.sku}</span>
                      <span className="text-[11px] font-semibold text-gray-500 mt-0.5 block">
                        ₹{item.priceAtPurchase} × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span className="font-black text-gray-900 text-sm shrink-0">
                    ₹{item.total}
                  </span>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY BREAKDOWN */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs space-y-2 text-xs font-semibold text-gray-600 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-600">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (Est.)</span>
                <span className="font-bold text-gray-900">₹{order.tax}</span>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1">
                <span>Grand Total</span>
                <span className="text-rose-600 font-extrabold">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* VISUAL ORDER TIMELINE */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Order Timeline Tracker
            </h3>

            {order.status === 'Cancelled' ? (
              <div className="p-4 bg-white border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-xs font-bold shadow-2xs">
                <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <p className="font-extrabold">Order Cancelled</p>
                  <p className="text-[11px] font-medium text-rose-600 mt-0.5">
                    This order was marked as cancelled on {order.updatedAt || order.createdAt}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs relative pl-8 space-y-6 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 text-xs">
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                        step.done
                          ? 'bg-rose-500 text-white ring-4 ring-rose-50 border border-rose-500'
                          : 'bg-white text-gray-300 border border-gray-300'
                      }`}
                    >
                      {step.done ? '✓' : ''}
                    </div>

                    <div>
                      <span className={`font-bold block ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      {step.time && (
                        <span className="text-[11px] text-gray-400 font-medium">{step.time}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: CUSTOMER, ADDRESS & PAYMENT */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-500" />
              <span>Customer Information</span>
            </h3>

            <div className="text-xs space-y-1 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <p className="font-extrabold text-gray-900 text-sm">{order.customer.name}</p>
              <p className="text-gray-600 font-medium">{order.customer.email}</p>
              <p className="text-gray-500">Phone: +91 {order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Shipping Address</span>
            </h3>

            <div className="text-xs text-gray-700 leading-relaxed space-y-1 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900">{order.shippingAddress.fullName}</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                  {order.shippingAddress.type || 'HOME'}
                </span>
              </div>
              <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — <strong>{order.shippingAddress.pincode}</strong></p>
              <p className="text-gray-400 font-medium pt-1">Phone: +91 {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-500" />
              <span>Payment Details</span>
            </h3>

            <div className="text-xs space-y-2 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Method</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Payment Status</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{order.paymentStatus}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <span className="text-gray-500 font-semibold">Txn ID</span>
                  <span className="font-mono font-bold text-gray-900">{order.transactionId}</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* UPDATE STATUS MODAL */}
      {isUpdateStatusModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsUpdateStatusModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />

          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl z-10 space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">Update Order Status</h3>
              <button onClick={() => setIsUpdateStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Current Status
                </label>
                <span className="text-xs font-extrabold text-gray-900 bg-[#f3f4f6] px-3 py-1 rounded-xl inline-block border border-gray-200/80">
                  {order.status}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select New Status
                </label>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateStatusModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl cursor-pointer hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL ORDER CONFIRMATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsCancelModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 space-y-4 border border-gray-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Cancel this order?</h3>
              <p className="text-xs text-gray-500 mt-1">
                The order status will be changed to Cancelled.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl cursor-pointer hover:bg-gray-200"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
