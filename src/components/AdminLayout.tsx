import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out from Admin panel.');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, enabled: true },
    { label: 'Products', path: '/admin/products', icon: Package, enabled: true },
    { label: 'Categories', path: '/admin/categories', icon: Layers, enabled: true },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, enabled: true },
    { label: 'Customers', path: '/admin/customers', icon: Users, enabled: true },
    { label: 'Promotions', path: '/admin/promotions', icon: Tag, enabled: false }
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col md:flex-row text-left font-sans">
      
      {/* DESKTOP PERSISTENT SIDEBAR */}
      <aside aria-label="Admin sidebar navigation" className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
        <div className="p-6 space-y-6">
          
          {/* Admin Brand Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2 text-white font-extrabold text-lg tracking-tight">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
              <span>Shoply Admin</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              v1.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Admin navigation" className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-2">
              Management
            </span>

            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

              if (!item.enabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed opacity-60"
                    title={`${item.label} management coming soon`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Store Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 py-2 rounded-xl border border-rose-500/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE ADMIN TOP HEADER */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-2 font-extrabold text-base">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          <span>Shoply Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg">
            Storefront
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 rounded-lg hover:bg-slate-800"
            aria-label="Toggle admin menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-3 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const IconComp = item.icon;
            if (!item.enabled) {
              return (
                <div key={item.label} className="flex items-center justify-between py-2 text-xs text-slate-600 opacity-60">
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded">Soon</span>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-2 text-xs font-bold ${
                  location.pathname === item.path ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">{user?.name}</span>
            <button onClick={handleLogout} className="text-rose-400 font-bold">
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <Outlet />
      </main>

    </div>
  );
};
