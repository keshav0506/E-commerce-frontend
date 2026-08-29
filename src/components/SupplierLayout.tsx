import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SupplierNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const desktopNotifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click or touch anywhere on screen
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const clickedDesktop = desktopNotifRef.current && desktopNotifRef.current.contains(target);
      const clickedMobile = mobileNotifRef.current && mobileNotifRef.current.contains(target);

      if (!clickedDesktop && !clickedMobile) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setSidebarOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);

  // Close on route changes
  useEffect(() => {
    setNotificationsOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

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
    { to: '/supplier/products', label: 'Products Catalog', icon: Package },
    { to: '/supplier/purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
    { to: '/supplier/shipments', label: 'Shipments', icon: Truck },
    { to: '/supplier/invoices', label: 'Invoices & Payouts', icon: Receipt },
    { to: '/supplier/profile', label: 'Business Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/supplier" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Shoply<span className="text-rose-500">.</span>
            </span>
            <span className="text-rose-600 font-bold text-[10px] px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full uppercase tracking-wider">
              Supplier
            </span>
          </Link>
        </div>

        <div className="relative" ref={mobileNotifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Mobile Notification Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
              <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-rose-50/40">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Supplier Alerts
                  </span>
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`p-3 hover:bg-rose-50/40 transition-colors cursor-pointer text-left ${
                        !n.isRead ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <p className={`text-xs font-bold ${!n.isRead ? 'text-rose-600' : 'text-gray-800'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Link to="/supplier" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Shoply<span className="text-rose-500">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                Supplier
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Supply Portal
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
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
        <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-rose-600 text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Verified Supplier'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
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
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Shoply Supplier Hub
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Real-time Inventory & Order Sync
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative" ref={desktopNotifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-rose-50/40">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Supplier Alerts
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[11px] text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      No notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`p-3.5 hover:bg-rose-50/40 transition-colors cursor-pointer text-left ${
                          !n.isRead ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-xs font-bold ${!n.isRead ? 'text-rose-600' : 'text-gray-800'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-1.5">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-mono">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#fafafa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
