import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingBag, AlertTriangle, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const {
    isLoading,
    apiError,
    refetchProducts,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Reset page to 1 whenever filters, search, sort, or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, searchQuery, selectedPriceRange, selectedMinRating, selectedMinDiscount, inStockOnly, sortOption, pageSize]);

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
          if (selectedCategoryId.toLowerCase() === 'for-you' || selectedCategoryId.toLowerCase() === 'foryou') {
            if (!p.featured && !p.isFeatured) return false;
          } else {
            const matchId = String(p.categoryId) === String(selectedCategoryId);
            const matchName = (p.categoryName || '').toLowerCase().includes(selectedCategoryId.toLowerCase());
            const matchSlug = (p.categorySlug || '').toLowerCase() === selectedCategoryId.toLowerCase();
            if (!matchId && !matchName && !matchSlug) {
              return false;
            }
          }
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.sku && p.sku.toLowerCase().includes(q)) ||
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
        if (inStockOnly && (!p.inStock || p.stock <= 0)) return false;

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

  const isForYouSelected = selectedCategoryId.toLowerCase() === 'for-you' || selectedCategoryId.toLowerCase() === 'foryou';
  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId || c.slug === selectedCategoryId);

  // Pagination calculations
  const totalItems = filteredAndSortedProducts.length;
  const isAllPages = pageSize === 0;
  const totalPages = isAllPages ? 1 : Math.max(1, Math.ceil(totalItems / (pageSize || 12)));
  const startIndex = isAllPages ? 0 : (currentPage - 1) * pageSize;
  const endIndex = isAllPages ? totalItems : Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = isAllPages ? filteredAndSortedProducts : filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const mainEl = document.getElementById('products-grid-top');
    if (mainEl) {
      mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Helper to generate numbered pagination pills with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

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
          {isForYouSelected ? (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> For You Picks
              </span>
            </>
          ) : selectedCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-rose-600 font-bold">{selectedCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              {isForYouSelected ? (
                <>
                  <span className="p-1.5 bg-rose-100 text-rose-600 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <span>Handpicked For You</span>
                </>
              ) : selectedCategoryObj ? (
                selectedCategoryObj.name
              ) : (
                'All Products Catalog'
              )}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isForYouSelected
                ? 'Curated starter kits, bundles, and premium recommendations based on your preferences.'
                : selectedCategoryObj
                ? selectedCategoryObj.description || `Browse quality verified products in ${selectedCategoryObj.name}.`
                : `Showing ${filteredAndSortedProducts.length} verified products directly from our database.`}
            </p>
          </div>

          {/* Quick Search in Header */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog, brands, SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* API ERROR STATE BANNER */}
        {apiError && (
          <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Backend Connection Notice</p>
                <p className="text-amber-700">{apiError}</p>
              </div>
            </div>
            <button
              onClick={refetchProducts}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">

          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-bold text-gray-900">Filter By</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedCategoryId === 'all'
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-[10px] text-gray-400 font-bold">{products.length}</span>
                  </button>

                  <button
                    onClick={() => handleCategoryChange('for-you')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isForYouSelected
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      For You (Kits & Bundles)
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {products.filter((p) => p.featured || p.isFeatured).length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => String(p.categoryId) === String(cat.id) || p.categoryName?.toLowerCase() === cat.name?.toLowerCase()
                    ).length;
                    const isSelected = selectedCategoryId === cat.id || selectedCategoryId.toLowerCase() === cat.slug?.toLowerCase();

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 text-rose-600 font-bold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-500', label: 'Under ₹500' },
                    { id: '500-1000', label: '₹500 – ₹1,000' },
                    { id: '1000-5000', label: '₹1,000 – ₹5,000' },
                    { id: 'above-5000', label: '₹5,000 & Above' }
                  ].map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center space-x-2.5 text-gray-600 hover:text-gray-900 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="text-rose-500 focus:ring-rose-500 h-3.5 w-3.5 border-gray-300"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Customer Rating</h3>
                <div className="space-y-1.5 text-xs">
                  {[
                    { rating: 4.5, label: '4.5★ & above' },
                    { rating: 4.0, label: '4.0★ & above' },
                    { rating: 3.5, label: '3.5★ & above' }
                  ].map((r) => (
                    <button
                      key={r.rating}
                      onClick={() => setSelectedMinRating(selectedMinRating === r.rating ? 0 : r.rating)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedMinRating === r.rating ? 'bg-amber-50 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{r.label}</span>
                      {selectedMinRating === r.rating && <span className="text-[10px] text-amber-600 font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center space-x-2.5 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded-sm text-rose-500 focus:ring-rose-500 h-4 w-4 border-gray-300"
                  />
                  <span>In Stock Products Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* MAIN PRODUCT AREA */}
          <main id="products-grid-top" className="lg:col-span-3 space-y-5">
            
            {/* Top Toolbar: Sorting, Page Size & Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:px-5 rounded-2xl border border-gray-100 shadow-2xs">
              <div className="text-xs font-bold text-gray-700">
                Showing{' '}
                <span className="text-rose-600 font-extrabold">
                  {totalItems > 0 ? `${startIndex + 1} – ${endIndex}` : '0'}
                </span>{' '}
                of <span className="text-gray-900 font-extrabold">{totalItems}</span> products
                {!isAllPages && totalPages > 1 && (
                  <span className="text-gray-400 font-medium ml-1.5">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>Show:</span>
                  <div className="inline-flex bg-gray-100/80 p-0.5 rounded-lg">
                    {[12, 24, 48, 0].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPageSize(size)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          pageSize === size
                            ? 'bg-white text-rose-600 shadow-2xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {size === 0 ? 'All' : size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 font-medium hidden md:flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    Sort:
                  </span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-rose-500 cursor-pointer"
                  >
                    <option value="recommended">Featured / Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Applied:</span>

                {isForYouSelected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    <Sparkles className="w-3 h-3" /> For You Picks
                    <button onClick={() => handleCategoryChange('all')} className="hover:text-rose-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ) : selectedCategoryId !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold border border-rose-100">
                    Category: {selectedCategoryObj ? selectedCategoryObj.name : selectedCategoryId}
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

            {/* LOADING SKELETON STATE */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs animate-pulse space-y-3"
                  >
                    <div className="w-full aspect-square bg-gray-100 rounded-xl" />
                    <div className="h-3 bg-gray-100 rounded-md w-1/3" />
                    <div className="h-4 bg-gray-100 rounded-md w-4/5" />
                    <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              /* 4-COLUMN PRODUCT GRID */
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
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
                    {searchQuery
                      ? `No products matched "${searchQuery}". Try different keywords or clearing filters.`
                      : 'No products currently match your filter criteria.'}
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full shadow-md transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* ACCESSIBLE BOTTOM PAGINATION BAR */}
            {!isAllPages && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 order-2 sm:order-1">
                  Showing <span className="font-bold text-gray-800">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-gray-800">{endIndex}</span> of{' '}
                  <span className="font-bold text-gray-800">{totalItems}</span> items
                </div>

                <div className="flex items-center space-x-1.5 order-1 sm:order-2">
                  {/* First Page Button */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First Page"
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Numbered Page Pills */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((num, index) => {
                      if (num === '...') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 py-1 text-xs text-gray-400 font-bold select-none"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = num as number;
                      const isActive = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last Page"
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
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

                  <button
                    onClick={() => {
                      handleCategoryChange('for-you');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      isForYouSelected ? 'bg-rose-50 text-rose-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    For You (Kits & Bundles)
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
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
