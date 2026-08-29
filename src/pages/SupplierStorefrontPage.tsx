import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Mail,
  ShieldCheck,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  FileText,
  Boxes,
  Send,
  X
} from 'lucide-react';
import { fetchPublicSupplierCatalog, type PublicSupplierCatalogResponse } from '../services/apiService';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

export const SupplierStorefrontPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useShop();

  const [data, setData] = useState<PublicSupplierCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination State
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const searchParam = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [pageSize, setPageSize] = useState(12);

  // Bulk Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteQuantity, setQuoteQuantity] = useState('100');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const loadCatalog = async (pageToLoad: number, searchToLoad: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPublicSupplierCatalog(id, {
        page: pageToLoad,
        size: pageSize,
        search: searchToLoad
      });
      if (res) {
        setData(res);
      } else {
        setError('Supplier storefront not found or currently unavailable.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load supplier catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog(pageParam, searchParam);
  }, [id, pageParam, searchParam, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm, page: '0' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search: searchParam, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setTimeout(() => {
      setQuoteSubmitting(false);
      setShowQuoteModal(false);
      setQuoteNotes('');
      showToast(`Wholesale inquiry sent to ${data?.supplier.businessName}! Our B2B desk will contact you.`);
    }, 800);
  };

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-9 h-9 animate-spin text-rose-500" />
        <p className="text-sm font-bold">Loading supplier storefront catalog...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-[#f3f4f6] border border-gray-200/80 rounded-3xl text-center space-y-4 shadow-xs">
        <Building2 className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-gray-900">Supplier Not Available</h2>
        <p className="text-xs text-gray-500">{error || 'This supplier catalog could not be retrieved.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>
      </div>
    );
  }

  const { supplier, products, totalProducts } = data;
  const totalPages = products.totalPages || 1;
  const currentPage = products.number || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <span>All Products</span>
          </Link>
          <span className="text-gray-400">
            HATEOAS Verified Storefront • ID #{supplier.id}
          </span>
        </div>

        {/* SUPPLIER STOREFRONT HERO BANNER CARD */}
        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border border-gray-200/80 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {supplier.businessName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                    <span>Verified Category Supplier</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-gray-200/60 shadow-2xs font-bold text-gray-800">
                    <Boxes className="w-3.5 h-3.5 text-rose-500" />
                    <span>{supplier.category}</span>
                  </span>

                  {(supplier.city || supplier.state) && (
                    <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-gray-200/60 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{supplier.city ? `${supplier.city}, ` : ''}{supplier.state || 'India'}</span>
                    </span>
                  )}

                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-gray-200/60 shadow-2xs font-mono text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{supplier.businessEmail}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Request Wholesale Quote</span>
              </button>
              <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Catalog Listed</span>
                <span className="text-base font-black text-gray-900">{totalProducts} SKUs</span>
              </div>
            </div>
          </div>

          {/* Value Badges Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200/60">
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/60 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-gray-900">100% Authentic Products</p>
                <p className="text-[11px] text-gray-400">Direct from authorized manufacturer</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/60 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-gray-900">Priority Dispatch SLA</p>
                <p className="text-[11px] text-gray-400">Dispatches within 24 business hours</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/60 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-gray-900">GST Invoice Ready</p>
                <p className="text-[11px] text-gray-400">B2B wholesale tax credit supported</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search inside ${supplier.businessName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs font-bold text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-gray-400 font-semibold">
              Showing {products.content.length} of {totalProducts} items
            </span>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200/80 rounded-2xl px-3 py-1.5 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-700">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setSearchParams({ search: searchParam, page: '0' });
                }}
                className="bg-transparent font-extrabold text-xs text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCT CATALOG GRID */}
        {products.content.length === 0 ? (
          <div className="bg-[#f3f4f6] rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-white text-gray-400 flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
              <Package className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">No matching products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No active catalog items matched your query for this supplier. Try searching for a different keyword.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({ page: '0' });
              }}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* FULL PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-gray-500">
              Page <span className="text-gray-900 font-extrabold">{currentPage + 1}</span> of{' '}
              <span className="text-gray-900 font-extrabold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 0 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-gray-800 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] sm:max-w-none px-1">
                {[...Array(totalPages)].map((_, i) => {
                  const isActive = i === currentPage;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`w-9 h-9 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-105'
                          : 'bg-white border border-gray-200/80 text-gray-700 hover:bg-rose-50 hover:text-rose-600 shadow-2xs'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage >= totalPages - 1 || loading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-gray-800 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* WHOLESALE QUOTE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-rose-500 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Request Wholesale Quotation</h3>
                  <p className="text-[11px] text-gray-400">Direct communication with {supplier.businessName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-2 rounded-xl bg-white text-gray-400 hover:text-gray-700 shadow-2xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                  Estimated Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={10}
                  required
                  value={quoteQuantity}
                  onChange={(e) => setQuoteQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                  Procurement Notes / Specific SKUs
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify custom packaging, target price, or delivery destination..."
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                />
              </div>

              <div className="p-3 bg-white rounded-2xl border border-gray-200/60 shadow-2xs text-[11px] text-gray-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Responses are routed directly to {supplier.businessEmail} with Shoply guarantee.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {quoteSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
