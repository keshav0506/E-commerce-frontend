import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  CupSoda,
  UtensilsCrossed,
  Milk,
  Smile,
  Home,
  Headphones,
  Shirt,
  Footprints,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    cartTotalCount,
    wishlist,
    activeCategories: categories,
    selectedCategoryId,
    setSelectedCategoryId
  } = useShop();

  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close User Card / Dropdown when clicking or touching anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close popovers on route changes
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled((prev) => {
            // Hysteresis prevents layout shift jitter loops
            if (!prev && currentY > 110) {
              return true;
            }
            if (prev && currentY < 40) {
              return false;
            }
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategoryId(catId);
    setMobileMenuOpen(false);
    if (catId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${catId}`);
    }
  };

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setUserDropdownOpen(!userDropdownOpen);
    }
  };

  // Helper to map category to clean Lucide icons
  const getCategoryIcon = (catOrName?: string | { slug?: string; name?: string; id?: string | number }) => {
    let key = '';
    if (typeof catOrName === 'string') {
      key = catOrName.toLowerCase();
    } else if (catOrName) {
      key = `${catOrName.slug || ''} ${catOrName.name || ''} ${catOrName.id || ''}`.toLowerCase();
    }

    if (key === 'all' || key.includes('for you') || key.includes('for-you')) return <Sparkles className="w-5 h-5 text-rose-500" />;
    if (key.includes('beverage') || key === '1') return <CupSoda className="w-5 h-5 text-amber-500" />;
    if (key.includes('snack') || key === '2') return <UtensilsCrossed className="w-5 h-5 text-orange-500" />;
    if (key.includes('dairy') || key === '3') return <Milk className="w-5 h-5 text-blue-500" />;
    if (key.includes('personal') || key.includes('care') || key === '4') return <Smile className="w-5 h-5 text-pink-500" />;
    if (key.includes('household') || key.includes('home') || key === '5') return <Home className="w-5 h-5 text-emerald-500" />;
    if (key.includes('accessories') || key.includes('accessory') || key === '6') return <Headphones className="w-5 h-5 text-purple-500" />;
    if (key.includes('cloth') || key.includes('apparel') || key === '7') return <Shirt className="w-5 h-5 text-indigo-500" />;
    if (key.includes('footwear') || key.includes('shoe') || key.includes('sneaker') || key === '8') return <Footprints className="w-5 h-5 text-teal-500" />;
    if (key.includes('electronic') || key.includes('gadget') || key === '9') return <Smartphone className="w-5 h-5 text-sky-500" />;
    return <Sparkles className="w-5 h-5 text-rose-500" />;
  };

  const hideCategoryBar =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100 transition-all duration-300">
      
      {/* TIER 1: TOP MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-6">
          
          {/* BRAND LOGO */}
          <Link
            to="/"
            onClick={() => {
              setSelectedCategoryId('all');
              setSearchQuery('');
            }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center group shrink-0 cursor-pointer"
          >
            <span>Shoply</span>
            <span className="text-rose-500 group-hover:scale-125 transition-transform duration-200">.</span>
          </Link>

          {/* CENTER WIDE SEARCH BAR */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Products, Brands, Categories and More..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50/90 hover:bg-gray-100/90 focus:bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-400 rounded-2xl border border-gray-200/90 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS: ADMIN, ACCOUNT, WISHLIST, CART, HAMBURGER */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">

            {/* ADMIN PANEL TOGGLE (STRICTLY FOR LOGGED-IN ADMINS ONLY) */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl shadow-xs border border-slate-700/80 transition-all cursor-pointer group"
                title="Switch to Admin Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-bold text-slate-100 tracking-tight hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Account Profile Button */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={handleAccountClick}
                className="flex items-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-all cursor-pointer"
                aria-label="Account"
              >
                <User className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-gray-600" />
                <span className="hidden sm:inline">{isLoggedIn ? user?.firstName || 'Account' : 'Sign In'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
              </button>

              {/* Logged-In User Popover */}
              {isLoggedIn && userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      {isAdmin && (
                        <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/account');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/wishlist');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>

                  {/* ONLY show Admin Panel option if user is verified ADMIN */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-900 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Admin Panel</span>
                    </button>
                  )}

                  <div className="h-px bg-gray-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className={`relative flex items-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                location.pathname === '/wishlist'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50/60'
              }`}
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 sm:w-4 sm:h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
              <span className="hidden md:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:static w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative flex items-center gap-1 sm:gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                location.pathname === '/cart'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-100'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 && (
                <span className={`px-1.5 py-0.2 sm:py-0.5 text-[10px] font-black rounded-full ${
                  location.pathname === '/cart' ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                }`}>
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button (Prominently next to Cart) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-700 hover:text-rose-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ml-0.5"
              aria-label="Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Input Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <input
              id="mobile-search"
              type="text"
              placeholder="Search products, brands and more..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-8 py-2 bg-gray-50 text-xs text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TIER 2: CATEGORIES ICON / TEXT STRIP (ZERO-SHIFT SMOOTH ANIMATION) */}
      {!hideCategoryBar && (
        <div className="bg-gray-50/90 backdrop-blur-md border-t border-gray-100/90 h-12 flex items-center transition-colors duration-300">
          <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
              
              {/* "For You" / "All Products" Option */}
              <button
                onClick={() => handleCategorySelect('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                  selectedCategoryId === 'all' && location.pathname === '/products'
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:text-rose-600 hover:bg-white/80'
                }`}
              >
                {/* Category Icon */}
                <span className={`transition-all duration-300 flex items-center justify-center overflow-hidden ${
                  isScrolled ? 'w-0 opacity-0 -ml-1 scale-0 pointer-events-none' : 'w-4.5 opacity-100 ml-0 scale-100'
                }`}>
                  {getCategoryIcon('all')}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">
                  For You
                </span>
              </button>

              <div className="w-px h-5 bg-gray-200 shrink-0 my-auto" />

              {/* Dynamically Loaded Active Categories */}
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id && location.pathname === '/products';
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : 'text-gray-700 hover:text-rose-600 hover:bg-white/80'
                    }`}
                  >
                    {/* Category Icon */}
                    <span className={`transition-all duration-300 flex items-center justify-center overflow-hidden ${
                      isScrolled ? 'w-0 opacity-0 -ml-1 scale-0 pointer-events-none' : 'w-4.5 opacity-100 ml-0 scale-100'
                    }`}>
                      {getCategoryIcon(cat)}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap">
                      {cat.name}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-left">
            <button
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
                setMobileMenuOpen(false);
                navigate('/');
              }}
              className="text-left px-3 py-2 text-gray-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategoryId('all');
                setMobileMenuOpen(false);
                navigate('/products');
              }}
              className="text-left px-3 py-2 text-gray-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl cursor-pointer"
            >
              All Products
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/wishlist');
              }}
              className="text-left px-3 py-2 text-gray-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl cursor-pointer flex items-center justify-between"
            >
              <span>My Wishlist</span>
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/cart');
              }}
              className="text-left px-3 py-2 text-gray-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl cursor-pointer flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartTotalCount}
              </span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/account');
                }}
                className="text-left px-3 py-2 text-gray-800 font-bold hover:bg-rose-50 hover:text-rose-600 rounded-xl cursor-pointer"
              >
                My Account
              </button>
            )}

            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="text-left px-3 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                Sign Out ({user?.firstName})
              </button>
            )}
          </nav>
        </div>
      )}

    </header>
  );
};
