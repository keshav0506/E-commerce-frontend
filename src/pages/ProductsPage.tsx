import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId
  } = useShop();

  const [searchParams, setSearchParams] = useSearchParams();

  // Read category from URL query string if present (e.g. /products?category=beverages)
  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setSelectedCategoryId(catFromUrl);
    }
  }, [searchParams, setSelectedCategoryId]);

  // Filter state
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedMinRating, setSelectedMinRating] = useState<number>(0);
  const [selectedMinDiscount, setSelectedMinDiscount] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync category change to URL
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategoryId !== 'all') {
          const matchId = String(p.categoryId) === String(selectedCategoryId);
          const matchName = (p.categoryName || '').toLowerCase().includes(selectedCategoryId.toLowerCase());
          if (!matchId && !matchName) {
            return false;
          }
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Price Filter
        if (selectedPriceRange === 'under-500' && p.price >= 500) return false;
        if (selectedPriceRange === '500-1000' && (p.price < 500 || p.price > 1000)) return false;
        if (selectedPriceRange === '1000-5000' && (p.price < 1000 || p.price > 5000)) return false;
        if (selectedPriceRange === 'above-5000' && p.price <= 5000) return false;

        // Rating Filter
        if (selectedMinRating > 0 && p.rating < selectedMinRating) return false;

        // Discount Filter
        if (selectedMinDiscount > 0 && p.discountPercent < selectedMinDiscount) return false;

        // Availability Filter
        if (inStockOnly && !p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return a.price - b.price;
        if (sortOption === 'price-high') return b.price - a.price;
        if (sortOption === 'rating') return b.rating - a.rating;
        if (sortOption === 'discount') return b.discountPercent - a.discountPercent;
        if (sortOption === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0;
      });
  }, [
    products,
    selectedCategoryId,
    searchQuery,
    selectedPriceRange,
    selectedMinRating,
    selectedMinDiscount,
    inStockOnly,
    sortOption
  ]);

  // Active Filter Count & Chips
  const activeFiltersCount =
    (selectedCategoryId !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (selectedMinRating > 0 ? 1 : 0) +
    (selectedMinDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategoryId('all');
    setSelectedPriceRange('all');
    setSelectedMinRating(0);
    setSelectedMinDiscount(0);
    setInStockOnly(false);
    setSearchQuery('');
    setSearchParams({});
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">Products</span>
          {selectedCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-rose-600 font-semibold">{selectedCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {selectedCategoryId === 'all' ? 'All Products' : `${selectedCategoryObj?.name || 'Category'} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Discover products selected for your everyday needs.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white text-sm text-gray-900 placeholder-gray-400 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Sidebar + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside aria-label="Filters sidebar" className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                  <span>Filters</span>
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-3">
                  Category
                </h4>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-sm">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategoryId === 'all'
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategoryId === cat.id
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Price Range Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-3">
                  Price
                </h4>
                <div className="space-y-2 text-xs text-gray-600 font-medium">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-500', label: 'Under ₹500' },
                    { id: '500-1000', label: '₹500 – ₹1,000' },
                    { id: '1000-5000', label: '₹1,000 – ₹5,000' },
                    { id: 'above-5000', label: '₹5,000+' }
                  ].map((range) => (
                    <label key={range.id} className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="text-rose-500 focus:ring-rose-500 h-4 w-4"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Rating Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-3">
                  Rating
                </h4>
                <div className="space-y-2 text-xs text-gray-600 font-medium">
                  {[
                    { val: 0, label: 'All Ratings' },
                    { val: 4.5, label: '4.5★ & above' },
                    { val: 4.0, label: '4.0★ & above' },
                    { val: 3.0, label: '3.0★ & above' }
                  ].map((rate) => (
                    <label key={rate.val} className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                      <input
                        type="radio"
                        name="minRating"
                        checked={selectedMinRating === rate.val}
                        onChange={() => setSelectedMinRating(rate.val)}
                        className="text-rose-500 focus:ring-rose-500 h-4 w-4"
                      />
                      <span>{rate.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Discount Filter */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-3">
                  Discount
                </h4>
                <div className="space-y-2 text-xs text-gray-600 font-medium">
                  {[
                    { val: 0, label: 'All Discounts' },
                    { val: 10, label: '10%+ OFF' },
                    { val: 20, label: '20%+ OFF' },
                    { val: 30, label: '30%+ OFF' }
                  ].map((disc) => (
                    <label key={disc.val} className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                      <input
                        type="radio"
                        name="minDiscount"
                        checked={selectedMinDiscount === disc.val}
                        onChange={() => setSelectedMinDiscount(disc.val)}
                        className="text-rose-500 focus:ring-rose-500 h-4 w-4"
                      />
                      <span>{disc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Stock Availability */}
              <div className="pt-1">
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 h-4 w-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* MAIN PRODUCTS GRID */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="text-xs sm:text-sm font-bold text-gray-900">
                <span>{filteredAndSortedProducts.length}</span>
                <span className="text-gray-500 font-normal ml-1">
                  {filteredAndSortedProducts.length === 1 ? 'product found' : 'products found'}
                </span>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

            </div>

            {/* Active Chips Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-gray-400 mr-1">Active filters:</span>

                {selectedCategoryId !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    Category: {selectedCategoryObj?.name}
                    <button onClick={() => handleCategoryChange('all')} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {selectedPriceRange !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    Price: {selectedPriceRange}
                    <button onClick={() => setSelectedPriceRange('all')} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {selectedMinRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    {selectedMinRating}★ & above
                    <button onClick={() => setSelectedMinRating(0)} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {selectedMinDiscount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    {selectedMinDiscount}%+ OFF
                    <button onClick={() => setSelectedMinDiscount(0)} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-gray-500 hover:text-rose-600 underline ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* 4-COLUMN PRODUCT GRID */}
            {filteredAndSortedProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white rounded-3xl p-12 text-center my-6 max-w-md mx-auto border border-gray-100 shadow-xs space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Try changing your active filters, adjusting price range, or clearing your search term.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full shadow-md transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* MOBILE FILTER SHEET */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      handleCategoryChange('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedCategoryId === 'all' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryChange(cat.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategoryId === cat.id ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">Price</h4>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-500', label: 'Under ₹500' },
                    { id: '500-1000', label: '₹500 – ₹1,000' },
                    { id: '1000-5000', label: '₹1,000 – ₹5,000' },
                    { id: 'above-5000', label: '₹5,000+' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedPriceRange(r.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg ${
                        selectedPriceRange === r.id ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
