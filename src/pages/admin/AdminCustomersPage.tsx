import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Users,
  X,
  RefreshCw,
  UserCheck,
  UserX,
  DollarSign,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, getCustomerStats, toggleCustomerStatus } = useShop();

  // Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [spendFilter, setSpendFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest-spend' | 'most-orders' | 'name'>('newest');

  // Customer List Enhanced with Derived Stats
  const customersWithStats = useMemo(() => {
    return customers.map((cust) => {
      const stats = getCustomerStats(cust.email);
      return {
        ...cust,
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent
      };
    });
  }, [customers, getCustomerStats]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = customersWithStats.length;
    const active = customersWithStats.filter((c) => c.status === 'active').length;
    const blocked = customersWithStats.filter((c) => c.status === 'blocked').length;
    const lifetimeRevenue = customersWithStats.reduce((sum, c) => sum + c.totalSpent, 0);
    return { total, active, blocked, lifetimeRevenue };
  }, [customersWithStats]);

  // Filtered & Sorted Customer List
  const filteredCustomers = useMemo(() => {
    return customersWithStats
      .filter((cust) => {
        // Search Filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesName = cust.name.toLowerCase().includes(q);
          const matchesEmail = cust.email.toLowerCase().includes(q);
          const matchesPhone = cust.phone.includes(q);
          if (!matchesName && !matchesEmail && !matchesPhone) return false;
        }

        // Status Filter
        if (statusFilter !== 'all' && cust.status !== statusFilter) return false;

        // Spend Filter
        if (spendFilter === 'top' && cust.totalSpent < 2000) return false;
        if (spendFilter === 'buyers' && cust.totalOrders === 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        if (sortBy === 'highest-spend') return b.totalSpent - a.totalSpent;
        if (sortBy === 'most-orders') return b.totalOrders - a.totalOrders;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customersWithStats, searchTerm, statusFilter, spendFilter, sortBy]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || spendFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSpendFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER */}
      <div className="pb-6 border-b border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customers Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage registered store customers, view order histories, and account statuses.
          </p>
        </div>

        <span className="text-xs font-bold text-gray-700 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs self-start sm:self-auto">
          {customers.length} Customers Total
        </span>
      </div>

      {/* METRICS SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-xl font-black text-gray-900">{metrics.total}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Accounts</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-emerald-700">{metrics.active}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Blocked Accounts</span>
            <UserX className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-rose-700">{metrics.blocked}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Lifetime Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-indigo-900">₹{metrics.lifetimeRevenue}</span>
        </div>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-xs sm:text-sm font-semibold text-gray-900 placeholder-gray-400 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          {/* Spend Filter */}
          <div className="md:col-span-2">
            <select
              value={spendFilter}
              onChange={(e) => setSpendFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
            >
              <option value="all">All Spenders</option>
              <option value="top">Top Spenders (&gt; ₹2000)</option>
              <option value="buyers">Active Buyers (&gt; 0 orders)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
            >
              <option value="newest">Sort: Newest Joined</option>
              <option value="highest-spend">Sort: Highest Spend</option>
              <option value="most-orders">Sort: Most Orders</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>

        </div>

        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Filters:</span>
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {spendFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100">
                Spend: {spendFilter === 'top' ? 'Top Spenders' : 'Active Buyers'}
                <button onClick={() => setSpendFilter('all')}><X className="w-3 h-3" /></button>
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

      {/* OPERATIONAL DESKTOP CUSTOMERS TABLE */}
      {filteredCustomers.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {cust.avatar ? (
                          <img src={cust.avatar} alt={cust.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 font-black flex items-center justify-center text-xs shrink-0">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/customers/${cust.id}`}
                            className="font-bold text-gray-900 hover:text-rose-600 transition-colors truncate block"
                          >
                            {cust.name}
                          </Link>
                          <p className="text-[11px] text-gray-400 truncate">{cust.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">
                      +91 {cust.phone}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 text-gray-500 font-medium whitespace-nowrap">
                      {cust.joinedDate}
                    </td>

                    {/* Orders Count */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-4 px-4 font-black text-gray-900 text-sm">
                      ₹{cust.totalSpent}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {cust.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3" /> Blocked
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/admin/customers/${cust.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => toggleCustomerStatus(cust.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                          cust.status === 'active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {cust.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">No customers found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try changing your active search terms or status filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
