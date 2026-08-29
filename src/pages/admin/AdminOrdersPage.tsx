import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  ShoppingBag,
  X,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { OrderStatus, PaymentStatus } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useShop();

  // Search, Filters & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Summary Metrics (Derived from orders)
  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const confirmed = orders.filter((o) => o.status === 'Confirmed').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
    return { total, pending, confirmed, processing, shipped, delivered, cancelled };
  }, [orders]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((ord) => {
        // Search Filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesId = ord.id.toLowerCase().includes(q);
          const matchesCustomer = ord.customer.name.toLowerCase().includes(q) || ord.customer.email.toLowerCase().includes(q);
          const matchesItem = ord.items.some((i) => i.productName.toLowerCase().includes(q));
          if (!matchesId && !matchesCustomer && !matchesItem) return false;
        }

        // Status Filter
        if (statusFilter !== 'all' && ord.status !== statusFilter) return false;

        // Payment Filter
        if (paymentFilter !== 'all' && ord.paymentStatus !== paymentFilter) return false;

        // Date Filter
        if (dateFilter === 'today' && !ord.createdAt.includes('Aug 10') && !ord.createdAt.includes('Aug 11')) return false;
        if (dateFilter === '7days' && ord.createdAt.includes('Aug 07')) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        if (sortBy === 'oldest') return a.id.localeCompare(b.id);
        if (sortBy === 'highest') return b.total - a.total;
        if (sortBy === 'lowest') return a.total - b.total;
        return 0;
      });
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy]);

  // Active Filter Chips Helper
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('all');
    setSortBy('newest');
  };

  // Status Badge Helper
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200"><RefreshCw className="w-3 h-3 animate-spin" /> Processing</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"><PackageCheck className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  const renderPaymentBadge = (payStatus: PaymentStatus) => {
    switch (payStatus) {
      case 'Paid':
        return <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Paid</span>;
      case 'Pending':
        return <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Pending</span>;
      case 'Failed':
        return <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Failed</span>;
      case 'Refunded':
        return <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Refunded</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER BANNER */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Order Fulfillment
            </span>
            <span className="text-xs text-gray-400 font-semibold">• {orders.length} Total Bookings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track, process, dispatch, and review customer purchase orders across all delivery stages.
          </p>
        </div>

        <span className="text-xs font-extrabold text-gray-800 bg-white px-4 py-2 rounded-2xl border border-gray-200/80 shadow-2xs self-start sm:self-auto">
          {orders.length} Orders Live
        </span>
      </div>

      {/* METRICS SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Total</span>
          <span className="text-xl font-black text-gray-900 mt-1 block">{metrics.total}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Pending</span>
          <span className="text-xl font-black text-amber-700 mt-1 block">{metrics.pending}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 block">Processing</span>
          <span className="text-xl font-black text-indigo-700 mt-1 block">{metrics.processing}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 block">Shipped</span>
          <span className="text-xl font-black text-purple-700 mt-1 block">{metrics.shipped}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">Delivered</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">{metrics.delivered}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-rose-600 block">Cancelled</span>
          <span className="text-xl font-black text-rose-700 mt-1 block">{metrics.cancelled}</span>
        </div>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-[#f3f4f6] rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by Order ID, customer, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm font-semibold text-gray-900 placeholder-gray-400 rounded-2xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Order Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200/80 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200/80 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer shadow-2xs"
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200/80 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer shadow-2xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Total</option>
              <option value="lowest">Sort: Lowest Total</option>
            </select>
          </div>

        </div>

        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200/70 flex-wrap">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Active Filters:</span>
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {paymentFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100">
                Payment: {paymentFilter}
                <button onClick={() => setPaymentFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100">
                Query: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:underline ml-2 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* OPERATIONAL DESKTOP ORDER TABLE */}
      {filteredOrders.length > 0 ? (
        <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f3f4f6] text-gray-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Date Placed</th>
                  <th className="py-3.5 px-4">Item Count</th>
                  <th className="py-3.5 px-4">Order Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {filteredOrders.map((order) => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      
                      {/* Order ID */}
                      <td className="py-4 px-5">
                        <Link
                          to={`/admin/orders/${encodeURIComponent(order.id)}`}
                          className="font-mono font-extrabold text-gray-900 hover:text-rose-600 transition-colors block"
                        >
                          {order.id}
                        </Link>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-[150px]">{order.customer.name}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{order.customer.email}</p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-gray-500 font-medium whitespace-nowrap">
                        {order.createdAt}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-black text-gray-900 text-sm">
                        ₹{order.total}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          {renderPaymentBadge(order.paymentStatus)}
                          <span className="block text-[10px] text-gray-400 font-medium">{order.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${encodeURIComponent(order.id)}`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f3f4f6] hover:bg-rose-50 text-gray-800 hover:text-rose-600 font-bold text-xs rounded-xl border border-gray-200/80 hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-[#f3f4f6] rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">No orders found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try changing your active search terms or status filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
