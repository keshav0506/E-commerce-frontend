import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      
      {/* HEADER BANNER CARD */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Admin Console
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Realtime Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Live operational metrics, catalog status, customer orders, and vendor activities.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-2xl border border-emerald-200 self-start sm:self-auto shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Store Live & Operating
        </span>
      </div>

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#f3f4f6] p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <div className="w-10 h-10 bg-white text-emerald-600 rounded-2xl flex items-center justify-center border border-gray-200/80 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{totalRevenue}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.5% vs last month
            </span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-[#f3f4f6] p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
            <div className="w-10 h-10 bg-white text-blue-600 rounded-2xl flex items-center justify-center border border-gray-200/80 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{totalOrders} Orders</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.2% vs last month
            </span>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-[#f3f4f6] p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Products</span>
            <div className="w-10 h-10 bg-white text-purple-600 rounded-2xl flex items-center justify-center border border-gray-200/80 shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{totalProducts} Products</span>
            <span className="text-xs font-bold text-gray-500 block mt-1.5">Active in Catalog</span>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-[#f3f4f6] p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Registered Users</span>
            <div className="w-10 h-10 bg-white text-amber-600 rounded-2xl flex items-center justify-center border border-gray-200/80 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{totalCustomers} Customers</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.4% new registrations
            </span>
          </div>
        </motion.div>

      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-8 bg-[#f3f4f6] rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Recent Customer Orders</h3>
              <p className="text-xs text-gray-500">Live order fulfillment streams</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f3f4f6] text-gray-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-gray-900">{ord.id}</td>
                    <td className="py-3.5 px-4">{ord.customer}</td>
                    <td className="py-3.5 px-4 text-gray-500">{ord.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
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
          <div className="bg-[#f3f4f6] rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Alerts</span>
              </h3>
              <Link to="/admin/products" className="text-[11px] font-bold text-rose-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-white border border-amber-200/60 rounded-2xl text-xs shadow-2xs">
                  <div className="flex items-center space-x-2.5 truncate">
                    <img src={prod.image} alt={prod.name} className="w-9 h-9 object-contain bg-white rounded-xl p-1 border border-gray-200/80" />
                    <span className="font-bold text-gray-900 truncate max-w-[130px]">{prod.name}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                    {prod.stock ?? 4} Left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products Card */}
          <div className="bg-[#f3f4f6] rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
              <h3 className="text-base font-extrabold text-gray-900">Best Performing Products</h3>
              <Link to="/admin/products" className="text-[11px] font-bold text-rose-600 hover:underline">
                Catalog
              </Link>
            </div>

            <div className="space-y-2.5">
              {topProducts.map((prod, idx) => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs text-xs">
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="font-mono text-xs font-black text-rose-500 w-4">#{idx + 1}</span>
                    <img src={prod.image} alt={prod.name} className="w-9 h-9 object-contain bg-[#f3f4f6] rounded-xl p-1 border border-gray-200/80" />
                    <div className="truncate">
                      <span className="font-bold text-gray-900 block truncate max-w-[120px]">{prod.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{prod.categoryName}</span>
                    </div>
                  </div>
                  <span className="font-black text-gray-900 shrink-0">₹{prod.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
