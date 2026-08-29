import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Building2,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out from Admin panel.');
    navigate('/login?role=admin');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true, enabled: true },
    { label: 'Products Catalog', path: '/admin/products', icon: Package, end: false, enabled: true },
    { label: 'Categories', path: '/admin/categories', icon: Layers, end: false, enabled: true },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag, end: false, enabled: true },
    { label: 'Suppliers & Vendors', path: '/admin/suppliers', icon: Building2, end: false, enabled: true },
    { label: 'Purchase Orders', path: '/admin/purchase-orders', icon: ClipboardList, end: false, enabled: true },
    { label: 'Customers', path: '/admin/customers', icon: Users, end: false, enabled: true },
    { label: 'Promotions & Deals', path: '/admin/promotions', icon: Tag, end: false, enabled: false }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 flex flex-col md:flex-row font-sans text-left">
      
      {/* MOBILE TOP HEADER */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200/80 sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#f3f4f6] text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Shoply<span className="text-rose-500">.</span>
            </span>
            <span className="text-rose-600 font-bold text-[10px] px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </Link>
        </div>

        <Link
          to="/"
          className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100 flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* PERSISTENT SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gray-200/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Shoply<span className="text-rose-500">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Admin Console
            </div>
            {navItems.map((item) => {
              const IconComp = item.icon;

              if (!item.enabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs font-extrabold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-[#f3f4f6]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account / Footer Actions */}
        <div className="p-4 border-t border-gray-200/80 space-y-3 bg-[#f3f4f6]/60">
          <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-rose-600 text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email || 'admin@ecommerce.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 py-2.5 rounded-2xl border border-rose-100 shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Customer Storefront</span>
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};
