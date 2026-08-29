import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Receipt,
  Building2,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSupplierNotificationsApi, markNotificationReadApi } from '../services/supplierService';
import type { SupplierNotification } from '../types/supplier';

export const SupplierLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SupplierNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = async () => {
    try {
      const data = await getSupplierNotificationsApi();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login?role=supplier');
  };

  const navLinks = [
    { to: '/supplier', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/supplier/purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
    { to: '/supplier/shipments', label: 'Shipments', icon: Truck },
    { to: '/supplier/invoices', label: 'Invoices & Payouts', icon: Receipt },
    { to: '/supplier/profile', label: 'Business Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/supplier" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm">
              S
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Shoply <span className="text-emerald-400 font-semibold text-xs px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">Supplier</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/supplier" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-emerald-500/20">
                S
              </div>
              <div>
                <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                  Shoply <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">B2B</span>
                </div>
                <div className="text-[11px] text-slate-400">Supplier Supply Portal</div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Supply Management
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account / Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Verified Supplier'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 bg-slate-800/60 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supplier Operational Network
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              TiDB Enterprise Procurement Gateway
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Supplier Alerts
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`p-3.5 hover:bg-slate-800/50 transition-colors cursor-pointer text-left ${
                          !n.isRead ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-xs font-semibold ${!n.isRead ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-1.5">{n.message}</p>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
