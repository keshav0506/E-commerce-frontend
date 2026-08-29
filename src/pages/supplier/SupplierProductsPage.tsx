import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Loader2,
  Boxes,
  X,
  ArrowUpDown
} from 'lucide-react';
import {
  getSupplierProductsApi,
  deleteSupplierProductApi,
  updateSupplierProductStockApi
} from '../../services/supplierService';
import { peekApiCache } from '../../services/api';
import type { SupplierProduct } from '../../types/supplier';

export const SupplierProductsPage: React.FC = () => {
  const cachedPage = peekApiCache<any>('/supplier/products?page=0&size=15') || peekApiCache<any>('/supplier/products');
  const [products, setProducts] = useState<SupplierProduct[]>(cachedPage?.content || []);
  const [loading, setLoading] = useState(!cachedPage);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(cachedPage?.totalPages || 1);
  const [totalElements, setTotalElements] = useState(cachedPage?.totalElements || 0);

  // Stock Adjustment Modal
  const [stockModalProduct, setStockModalProduct] = useState<SupplierProduct | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [savingStock, setSavingStock] = useState(false);

  const fetchProducts = async (isBackground = false) => {
    if (!isBackground && products.length === 0) setLoading(true);
    try {
      const res = await getSupplierProductsApi({
        search: search.trim() || undefined,
        page,
        size: 15
      });
      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch supplier products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(products.length > 0 && page === 0 && !search);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delist '${name}' from your catalog?`)) return;
    try {
      await deleteSupplierProductApi(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delist product.');
    }
  };

  const handleOpenStockModal = (prod: SupplierProduct) => {
    setStockModalProduct(prod);
    setNewStockValue(prod.stock);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    setSavingStock(true);
    try {
      await updateSupplierProductStockApi(stockModalProduct.id, newStockValue);
      setStockModalProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock.');
    } finally {
      setSavingStock(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-rose-500" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your brand's listings, retail prices, and real-time inventory levels.
          </p>
        </div>

        <Link
          to="/supplier/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Listings</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{totalElements}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Low Stock (&le;5)</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">
              {products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <X className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-xl font-black text-rose-600 mt-0.5">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, SKU, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="text-xs font-bold text-gray-400">Loading catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No products listed yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Start building your brand catalog. Add products with images, wholesale margins, and stock inventory.
            </p>
            <Link
              to="/supplier/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Product Details</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Retail Price</th>
                  <th className="py-3.5 px-5">Inventory Stock</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {products.map((p) => {
                  const isLowStock = p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);
                  const isOutOfStock = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0 bg-gray-50 shadow-xs"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-xs">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-gray-700">
                                {p.sku}
                              </span>
                              {p.brand && <span className="text-gray-500 font-medium">• {p.brand}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 font-semibold text-gray-700">
                        {p.categoryName || 'General'}
                      </td>

                      {/* Retail Price */}
                      <td className="py-3.5 px-5">
                        <div className="font-black text-gray-900">
                          ₹{p.price.toFixed(2)}
                        </div>
                        {p.discountPrice && p.discountPrice > 0 && (
                          <span className="text-[10px] text-rose-500 font-bold">
                            Offer: ₹{p.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${
                              isOutOfStock
                                ? 'text-rose-600'
                                : isLowStock
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {p.stock} units
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(p)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Adjust Stock"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {isLowStock && (
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                            <X className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-rose-500" />
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/supplier/products/${p.id}/edit`}
                            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delist Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 rounded-xl font-bold text-gray-700 border border-gray-200"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 rounded-xl font-bold text-gray-700 border border-gray-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjuster Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-gray-100 shadow-2xl p-6 space-y-4 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Adjust Stock Inventory</h3>
                <p className="text-xs text-gray-400 truncate max-w-[220px]">{stockModalProduct.name}</p>
              </div>
              <button
                onClick={() => setStockModalProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Available Warehouse Stock (Units)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(Number(e.target.value))}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStock}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {savingStock && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
