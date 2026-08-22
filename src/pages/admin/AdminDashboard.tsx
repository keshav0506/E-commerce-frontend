import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminDashboard: React.FC = () => {
  const { products } = useShop();

  // Metrics
  const totalRevenue = '₹1,24,500';
  const totalOrders = 245;
  const totalProducts = products.length;
  const totalCustomers = 126;

  // Mock Recent Orders
  const recentOrders = [
    { id: '#ORD-2026-00124', customer: 'Keshav Khandelwal', date: 'Aug 10, 2026', status: 'Delivered', total: '₹2,499' },
    { id: '#ORD-2026-00123', customer: 'Priya Verma', date: 'Aug 10, 2026', status: 'Processing', total: '₹1,299' },
    { id: '#ORD-2026-00122', customer: 'Rahul Sharma', date: 'Aug 09, 2026', status: 'Shipped', total: '₹3,799' },
    { id: '#ORD-2026-00121', customer: 'Amit Patel', date: 'Aug 09, 2026', status: 'Delivered', total: '₹899' },
    { id: '#ORD-2026-00120', customer: 'Sneha Kapoor', date: 'Aug 08, 2026', status: 'Delivered', total: '₹4,999' }
  ];

  // Low Stock Items (Stock <= 10 or badge)
  const lowStockItems = products
    .filter((p) => (p.stock ?? 24) <= 10 || p.badge === 'LIMITED TIME')
    .slice(0, 4);

  // Top Performing Products
  const topProducts = products.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here's an operational overview of your store.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          Store Live & Operating
        </span>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900">{totalRevenue}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5% vs last month
            </span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900">{totalOrders} Orders</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.2% vs last month
            </span>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900">{totalProducts} Products</span>
            <span className="text-xs font-semibold text-gray-500 block mt-1">Active in Catalog</span>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Customers</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-gray-900">{totalCustomers} Customers</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.4% new registrations
            </span>
          </div>
        </motion.div>

      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900">Recent Orders</h3>
            <button
              disabled
              className="text-xs font-bold text-gray-400 cursor-not-allowed"
              title="Orders management coming soon"
            >
              View All (Coming Soon)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{ord.id}</td>
                    <td className="py-3.5 px-4">{ord.customer}</td>
                    <td className="py-3.5 px-4 text-gray-500">{ord.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-gray-900">{ord.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOW STOCK & TOP PRODUCTS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Low Stock Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low Stock Alerts</span>
            </h3>

            <div className="space-y-3">
              {lowStockItems.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-amber-50/40 border border-amber-100 rounded-2xl text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <img src={prod.image} alt={prod.name} className="w-8 h-8 object-contain bg-white rounded-lg p-1 border border-gray-100" />
                    <span className="font-bold text-gray-900 truncate max-w-[130px]">{prod.name}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                    {prod.stock ?? 4} Low
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Best Performing Products</h3>

            <div className="space-y-3">
              {topProducts.map((prod, idx) => (
                <div key={prod.id} className="flex items-center justify-between text-xs pb-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                    <img src={prod.image} alt={prod.name} className="w-8 h-8 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100" />
                    <div className="truncate">
                      <span className="font-bold text-gray-900 block truncate max-w-[120px]">{prod.name}</span>
                      <span className="text-[10px] text-gray-400">{prod.categoryName}</span>
                    </div>
                  </div>
                  <span className="font-black text-rose-600 shrink-0">₹{prod.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
