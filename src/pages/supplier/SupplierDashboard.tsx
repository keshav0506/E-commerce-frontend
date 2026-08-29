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
import { peekApiCache } from '../../services/api';
import type { SupplierDashboardMetrics } from '../../types/supplier';

export const SupplierDashboard: React.FC = () => {
  const cachedMetrics = peekApiCache<SupplierDashboardMetrics>('/supplier/dashboard');
  const [metrics, setMetrics] = useState<SupplierDashboardMetrics | null>(cachedMetrics);
  const [loading, setLoading] = useState(!cachedMetrics);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (isBackground = false) => {
    if (!isBackground && !metrics) setLoading(true);
    setError(null);
    try {
      const data = await getSupplierDashboardApi();
      setMetrics(data);
    } catch (err: any) {
      if (!metrics) {
        setError(err.message || 'Failed to load supplier dashboard metrics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(!!metrics);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-gray-100 rounded-3xl p-5" />
          ))}
        </div>
        <div className="h-64 bg-white border border-gray-100 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-gray-900">Dashboard Unavailable</h3>
        <p className="text-xs text-rose-600 leading-relaxed">{error}</p>
        <button
          onClick={() => fetchDashboard()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold shadow-xs cursor-pointer"
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
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
      badge: 'Action Required',
      link: '/supplier/purchase-orders?status=PENDING'
    },
    {
      title: 'Orders To Ship',
      value: metrics?.ordersToShip || 0,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'In Processing',
      link: '/supplier/purchase-orders?status=PROCESSING'
    },
    {
      title: 'Active Shipments',
      value: metrics?.inTransit || 0,
      icon: Truck,
      color: 'bg-purple-50 text-purple-600 border border-purple-100',
      badge: 'In Transit',
      link: '/supplier/shipments'
    },
    {
      title: 'Completed Supplies',
      value: metrics?.completedSupplies || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badge: 'Delivered',
      link: '/supplier/purchase-orders?status=DELIVERED'
    }
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Supplier Portal
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time procurement oversight, live dispatch status, and product catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboard()}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/supplier/purchase-orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20"
          >
            View Purchase Orders
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
              className="bg-[#f3f4f6] border border-gray-200/80 hover:border-rose-200/90 rounded-3xl p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:shadow-md shadow-xs group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center shadow-2xs ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs">
                  {stat.badge}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <div className="text-2xl font-black text-gray-900 mt-1 group-hover:text-rose-600 transition-colors">
                  {stat.value}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Performance & Revenue Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-rose-500 shadow-2xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fulfilled Volume</p>
            <div className="text-xl font-black text-gray-900 mt-0.5">
              ₹{(metrics?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-rose-600 font-bold mt-0.5">
              Across {metrics?.completedSupplies || 0} completed shipments
            </p>
          </div>
        </div>

        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-blue-500 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fulfillment Rate</p>
            <div className="text-xl font-black text-gray-900 mt-0.5">
              {metrics?.fulfillmentRate || 100}%
            </div>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              {metrics?.rejectedOrders || 0} orders declined
            </p>
          </div>
        </div>

        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-purple-500 shadow-2xs">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Purchase Orders</p>
            <div className="text-xl font-black text-gray-900 mt-0.5">
              {metrics?.totalPurchaseOrders || 0}
            </div>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Lifetime procurement batches
            </p>
          </div>
        </div>
      </div>

      {/* Brand Catalog & Inventory Highlight Card */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50/50 to-white border border-rose-100 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 shadow-xs shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Your Brand Product Catalog</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {metrics?.totalProductsListed || 0} products listed • {metrics?.lowStockProductsCount || 0} items low on stock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            to="/supplier/products"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Manage Catalog
          </Link>
          <Link
            to="/supplier/products/new"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-rose-500/20"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Recent Purchase Orders Table */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-200/60 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Recent Purchase Orders</h2>
            <p className="text-xs text-gray-500">Latest procurement requests assigned to your supplier profile.</p>
          </div>
          <Link
            to="/supplier/purchase-orders"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!metrics?.recentPurchaseOrders || metrics.recentPurchaseOrders.length === 0) ? (
          <div className="p-12 text-center text-gray-400 text-xs space-y-2">
            <ClipboardList className="w-8 h-8 text-gray-300 mx-auto" />
            <p>No purchase orders assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 text-gray-400 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">PO Number</th>
                  <th className="py-3.5 px-5">Order Date</th>
                  <th className="py-3.5 px-5">Items</th>
                  <th className="py-3.5 px-5">Total Amount</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {metrics.recentPurchaseOrders.map((po) => {
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

                  return (
                    <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-gray-900">
                        {po.poNumber}
                      </td>
                      <td className="py-3.5 px-5 text-gray-500">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-gray-700">
                        {po.totalItemsCount || po.items?.length || 1} SKU(s)
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-gray-900">
                        ₹{Number(po.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[po.status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to={`/supplier/purchase-orders/${po.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-rose-600 border border-gray-200 hover:border-rose-100 text-xs font-bold transition-colors"
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
