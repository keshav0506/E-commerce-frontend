import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Package,
  Boxes,
  RefreshCw
} from 'lucide-react';
import { getSupplierDashboardApi } from '../../services/supplierService';
import type { SupplierDashboardMetrics } from '../../types/supplier';

export const SupplierDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SupplierDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSupplierDashboardApi();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load supplier dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl p-4" />
          ))}
        </div>
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Dashboard Unavailable</h3>
        <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Pending POs',
      value: metrics?.pendingOrders || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      badge: 'Action Required',
      link: '/supplier/purchase-orders?status=PENDING'
    },
    {
      title: 'Orders To Ship',
      value: metrics?.ordersToShip || 0,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      badge: 'In Processing',
      link: '/supplier/purchase-orders?status=PROCESSING'
    },
    {
      title: 'Active Shipments',
      value: metrics?.inTransit || 0,
      icon: Truck,
      color: 'from-purple-500 to-indigo-500',
      badge: 'In Transit',
      link: '/supplier/shipments'
    },
    {
      title: 'Completed Supplies',
      value: metrics?.completedSupplies || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Delivered',
      link: '/supplier/invoices'
    }
  ];

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header & Quick Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Supplier Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time supply chain overview, pending purchase orders, and fulfillment health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Link
            to="/supplier/purchase-orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20"
          >
            View All Purchase Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-slate-950 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {stat.badge}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                <div className="text-2xl font-black text-white mt-1 group-hover:text-emerald-400 transition-colors">
                  {stat.value}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Performance & Revenue Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Fulfilled Volume</p>
            <div className="text-xl font-black text-white mt-0.5">
              ₹{(metrics?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Across {metrics?.completedSupplies || 0} completed orders
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Order Fulfillment Rate</p>
            <div className="text-xl font-black text-white mt-0.5">
              {metrics?.fulfillmentRate || 100}%
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {metrics?.rejectedOrders || 0} orders declined
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Procurement Orders</p>
            <div className="text-xl font-black text-white mt-0.5">
              {metrics?.totalPurchaseOrders || 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Platform lifetime assignments
            </p>
          </div>
        </div>
      </div>

      {/* Recent Purchase Orders Table */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Purchase Orders</h2>
            <p className="text-xs text-slate-400">Latest procurement requests assigned to your supplier profile.</p>
          </div>
          <Link
            to="/supplier/purchase-orders"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {(!metrics?.recentPurchaseOrders || metrics.recentPurchaseOrders.length === 0) ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No purchase orders assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">PO Number</th>
                  <th className="py-3.5 px-4 font-semibold">Order Date</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {metrics.recentPurchaseOrders.map((po) => {
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

                  return (
                    <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {po.poNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {po.totalItemsCount || po.items?.length || 1} SKU(s)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[po.status] || 'bg-slate-800 text-slate-300'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/supplier/purchase-orders/${po.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                        >
                          Details
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
