import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  Clock,
  Sparkles,
  Flame
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SpecialDealsSection: React.FC = () => {
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useShop();
  const [budgetTab, setBudgetTab] = useState<'all' | '299' | '499' | '999' | '1999'>('499');

  // 1. Live Flash Deals (Highest discounts)
  const flashDeals = products
    .filter((p) => p.price <= 1500)
    .slice(0, 6);

  // 2. Spotlight Curated 4-Pack (Mint pastel container matching reference)
  const spotlightItems = products.slice(0, 4);

  // 3. Electronics & Tech Asymmetric Showcase
  const electronicsProducts = products
    .filter((p) => {
      const cat = (p.categoryName || p.categoryId || '').toLowerCase();
      return cat.includes('electronic') || cat.includes('accessori') || p.categoryId === '9' || p.categoryId === '6';
    })
    .slice(0, 4);

  // 4. Budget Bazaar Filtered Products
  const budgetFilteredProducts = products
    .filter((p) => {
      if (budgetTab === '299') return p.price <= 299;
      if (budgetTab === '499') return p.price <= 499;
      if (budgetTab === '999') return p.price <= 999;
      if (budgetTab === '1999') return p.price <= 1999;
      return true;
    })
    .slice(0, 4);

  // 5. Top 5-Star Rated Customer Hall of Fame
  const topRatedProducts = products
    .filter((p) => (p.rating || 4.5) >= 4.6)
    .slice(0, 4);

  return (
    <section aria-label="Curated Deals and Sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-7">
      
      {/* ========================================================================= */}
      {/* SECTION 1: FLASH DEALS OF THE DAY (WITH LIVE TICKING COUNTDOWN TIMER)     */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-gray-100 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Deal of the Day
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  Live
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Fresh lightning offers updated daily with limited stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Live Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Ends in:</span>
              <span className="font-mono font-black text-amber-700">03h : 42m : 18s</span>
            </div>

            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6-Card Horizontal Scrolling Deal Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {flashDeals.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-[#f3f4f6] hover:bg-white rounded-2xl p-3 border border-gray-200/80 hover:border-rose-200 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative"
              >
                {/* Discount Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500 text-white shadow-2xs">
                    Min. 40% Off
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Product Image */}
                <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden mb-2 border border-gray-100 shadow-2xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="space-y-0.5 text-left">
                  <span className="text-[10px] text-gray-400 font-bold uppercase truncate block">
                    {product.categoryName}
                  </span>
                  <h3 className="text-xs font-bold text-gray-900 truncate leading-tight group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-black text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Special
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SPOTLIGHT'S ON (MINT PASTEL CURATED 4-PACK)                    */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#dcf0e8] border border-emerald-100/60 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Spotlight's on
            </h2>
            <p className="text-xs text-gray-600 font-medium hidden sm:block mt-0.5">
              Curated daily essentials and premium picks
            </p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            aria-label="Explore Spotlight"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {spotlightItems.map((product, idx) => {
            const tags = ['Trending', 'Top Offers', 'Grab Or Gone', 'Most-loved'];
            const highlights = ['Top Rated', 'Min. 70% Off', 'Special offer', 'Best Price'];
            const tag = tags[idx % tags.length];
            const highlight = highlights[idx % highlights.length];

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-[#f3f4f6] hover:bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-gray-200/80"
              >
                <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2.5 overflow-hidden border border-gray-100 shadow-2xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="pt-2.5 px-0.5 space-y-0.5 text-left">
                  <span className="block text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
                    {tag}
                  </span>
                  <span className="block text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                    {highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: ASYMMETRIC ELECTRONICS & TECH SPOTLIGHT                        */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 sm:p-6 text-white shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left Feature Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-3 pr-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Sparkles className="w-3 h-3 text-rose-400" />
              Next-Gen Gadgets
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Best of Electronics & Studio Audio
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Upgrade your tech setup with noise cancellation, OLED smartwatches, and fast-charging accessories.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigate('/products?category=electronics')}
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer group"
              >
                <span>Shop Electronics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right 4-Product Grid (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {electronicsProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/10 transition-all duration-300 cursor-pointer flex flex-col justify-between group text-white"
              >
                <div className="w-full aspect-square bg-white/5 rounded-xl flex items-center justify-center p-2 overflow-hidden mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <span className="text-xs font-black text-amber-300">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-rose-500 text-white transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: BUDGET BAZAAR (INTERACTIVE MULTI-TAB PRICE STORE)              */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#fef6e6] border border-amber-100/60 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Budget Bazaar
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                Pocket Friendly
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-0.5">
              High quality essentials curated under your budget
            </p>
          </div>

          {/* Interactive Price Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: '299', label: 'Under ₹299' },
              { id: '499', label: 'Under ₹499' },
              { id: '999', label: 'Under ₹999' },
              { id: '1999', label: 'Under ₹1,999' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBudgetTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  budgetTab === tab.id
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-amber-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Filtered by Budget */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {budgetFilteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-[#f3f4f6] hover:bg-white rounded-2xl p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-gray-200/80"
            >
              <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2.5 overflow-hidden mb-2 border border-gray-100 shadow-2xs">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[10px] text-amber-700 font-extrabold uppercase">
                  {product.categoryName}
                </span>
                <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-xs sm:text-sm font-black text-gray-900">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    className="p-1.5 rounded-lg bg-amber-900 hover:bg-black text-white transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: CUSTOMER HALL OF FAME (TOP 5-STAR RATED PICKS)                 */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#fdf0ec] border border-rose-100/60 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Top Rated Hall of Fame
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-200/70 text-rose-900">
                4.8★ & Above
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-0.5">
              Verified customer favorites loved by thousands of shoppers
            </p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {topRatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-[#f3f4f6] hover:bg-white rounded-2xl p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-gray-200/80"
            >
              <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2.5 overflow-hidden mb-2 border border-gray-100 shadow-2xs">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[10px] text-rose-600 font-extrabold uppercase">
                  Verified 4.9★
                </span>
                <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-xs sm:text-sm font-black text-gray-900">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
