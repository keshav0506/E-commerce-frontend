import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, deleteProduct } = useShop();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Filtered Product Dataset
  const filteredAdminProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          prod.name.toLowerCase().includes(q) ||
          prod.categoryName.toLowerCase().includes(q) ||
          prod.description.toLowerCase().includes(q) ||
          prod.id.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category Filter
      if (categoryFilter !== 'all' && prod.categoryId !== categoryFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter === 'active' && (!prod.inStock || prod.badge === 'DRAFT')) return false;
      if (statusFilter === 'draft' && prod.badge !== 'DRAFT') return false;
      if (statusFilter === 'outofstock' && prod.inStock) return false;

      return true;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleDeleteConfirm = (id: string) => {
    deleteProduct(id);
    setDeletingProductId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store inventory, pricing, and product details.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Field */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search products by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-xs sm:text-sm font-semibold text-gray-900 placeholder-gray-400 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.itemCount})
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>

        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-2 border-t border-gray-100">
          <span>Showing {filteredAdminProducts.length} of {products.length} products</span>
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* OPERATIONAL PRODUCT TABLE */}
      {filteredAdminProducts.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {filteredAdminProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Product Cell */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/products/${product.id}`}
                            className="font-bold text-gray-900 hover:text-rose-600 transition-colors block truncate max-w-xs"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[11px] text-gray-400 font-mono">
                            SKU-{product.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Cell */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 font-bold text-[11px] rounded-lg">
                        {product.categoryName}
                      </span>
                    </td>

                    {/* Price Cell */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Cell */}
                    <td className="py-4 px-4">
                      <span className={`font-bold ${(product.stock || 24) <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.stock || 24} units
                      </span>
                    </td>

                    {/* Status Cell */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          product.inStock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {product.inStock ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {product.inStock ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Actions Cell */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try changing your active search terms or category filters.
            </p>
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setDeletingProductId(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Delete product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This product will be removed from both Admin and Customer storefront catalogs.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingProductId)}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
