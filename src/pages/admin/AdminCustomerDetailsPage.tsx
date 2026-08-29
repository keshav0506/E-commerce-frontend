import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  User,
  ShoppingBag,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Truck,
  PackageCheck,
  XCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { OrderStatus } from '../../types';

export const AdminCustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, toggleCustomerStatus, getCustomerOrders, getCustomerStats } = useShop();

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="bg-[#f3f4f6] rounded-3xl p-10 max-w-md w-full border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
            <User className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Customer Not Found</h2>
          <p className="text-xs text-gray-500">
            The customer profile you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Customers</span>
          </Link>
        </div>
      </div>
    );
  }

  const customerOrders = getCustomerOrders(customer.email);
  const stats = getCustomerStats(customer.email);
  const avgOrderValue = stats.totalOrders > 0 ? Math.round(stats.totalSpent / stats.totalOrders) : 0;

  // Status Badge Helper for Orders
  const renderOrderStatusBadge = (status: OrderStatus) => {
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
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-2">
        <Link to="/admin" className="hover:text-rose-600">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/admin/customers" className="hover:text-rose-600">Customers</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-extrabold">{customer.name}</span>
      </nav>

      {/* HEADER WITH ACTIONS */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-2xs shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 text-rose-600 font-black flex items-center justify-center text-xl shadow-2xs shrink-0">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {customer.name}
                </h1>
                {customer.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5" /> Blocked Account
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-gray-700">{customer.email}</span>
                <span>•</span>
                <span className="font-semibold text-gray-700">+91 {customer.phone}</span>
                <span>•</span>
                <span>Member since {customer.joinedDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleCustomerStatus(customer.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto ${
              customer.status === 'active'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {customer.status === 'active' ? 'Block Customer Account' : 'Unblock Customer Account'}
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Total Orders</span>
          <span className="text-xl font-black text-gray-900 mt-1 block">{stats.totalOrders}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Lifetime Spend</span>
          <span className="text-xl font-black text-rose-600 mt-1 block">₹{stats.totalSpent}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Avg. Order Value</span>
          <span className="text-xl font-black text-gray-900 mt-1 block">₹{avgOrderValue}</span>
        </div>
        <div className="bg-[#f3f4f6] p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Account Status</span>
          <span className={`text-xl font-black mt-1 block capitalize ${customer.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {customer.status}
          </span>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ORDER HISTORY & SAVED ADDRESSES */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CUSTOMER ORDER HISTORY */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3 flex items-center justify-between">
              <span>Order History ({customerOrders.length})</span>
              <ShoppingBag className="w-4 h-4 text-rose-500" />
            </h3>

            {customerOrders.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f3f4f6] text-gray-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/80">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                    {customerOrders.map((ord) => {
                      const totalItems = ord.items.reduce((s, i) => s + i.quantity, 0);
                      return (
                        <tr key={ord.id} className="hover:bg-gray-50/70">
                          <td className="py-3 px-4 font-mono font-extrabold text-gray-900">{ord.id}</td>
                          <td className="py-3 px-4 text-gray-500 font-medium">{ord.createdAt}</td>
                          <td className="py-3 px-4">{totalItems} items</td>
                          <td className="py-3 px-4 font-black text-gray-900">₹{ord.total}</td>
                          <td className="py-3 px-4">{renderOrderStatusBadge(ord.status)}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => navigate(`/admin/orders/${encodeURIComponent(ord.id)}`)}
                              className="px-3 py-1.5 bg-[#f3f4f6] hover:bg-rose-50 border border-gray-200/80 hover:border-rose-200 text-gray-800 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center bg-white rounded-2xl border border-gray-200/80">
                This customer has not placed any orders yet.
              </p>
            )}
          </div>

          {/* SAVED ADDRESSES */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3 flex items-center justify-between">
              <span>Saved Delivery Addresses ({customer.addresses?.length || 0})</span>
              <MapPin className="w-4 h-4 text-rose-500" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customer.addresses?.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-2xs space-y-1 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{addr.fullName}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{addr.house}, {addr.street}</p>
                  <p className="text-gray-600">{addr.city}, {addr.state} — <strong>{addr.pincode}</strong></p>
                  <p className="text-gray-400 pt-1 font-medium">Phone: +91 {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK INFO & STATUS CONTROL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Details Card */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Customer Profile
            </h3>

            <div className="space-y-3 text-xs bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Full Name</span>
                <span className="font-bold text-gray-900">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Email Address</span>
                <span className="font-bold text-gray-900">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Phone Number</span>
                <span className="font-bold text-gray-900">+91 {customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Registration Date</span>
                <span className="font-bold text-gray-700">{customer.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Account Status Control */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-2">
              Account Status Control
            </h3>
            <p className="text-xs text-gray-500">
              {customer.status === 'active'
                ? 'Blocking this customer will prevent them from placing new orders on the storefront.'
                : 'Unblocking this customer will restore their purchasing access.'}
            </p>
            <button
              onClick={() => toggleCustomerStatus(customer.id)}
              className={`w-full py-3 rounded-2xl font-extrabold text-xs shadow-xs transition-colors cursor-pointer ${
                customer.status === 'active'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {customer.status === 'active' ? 'Block Customer Account' : 'Unblock Customer Account'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
