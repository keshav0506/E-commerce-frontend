import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, deleteCategory, toggleCategoryStatus, getCategoryProductCount } = useShop();

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'most_products'>('name_asc');

  // Deletion Modal state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        // Search Filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches =
            cat.name.toLowerCase().includes(q) ||
            cat.slug.toLowerCase().includes(q) ||
            cat.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status Filter
        if (statusFilter === 'active' && cat.status === 'inactive') return false;
        if (statusFilter === 'inactive' && cat.status !== 'inactive') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'most_products') {
          const countA = getCategoryProductCount(a.id);
          const countB = getCategoryProductCount(b.id);
          return countB - countA;
        }
        return 0;
      });
  }, [categories, searchTerm, statusFilter, sortBy, getCategoryProductCount]);

  const handleDeleteConfirm = (cat: Category) => {
    const success = deleteCategory(cat.id);
    if (success) {
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize and manage your store product categories.
          </p>
        </div>

        <Link
          to="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* TOOLBAR: SEARCH, STATUS FILTER & SORT */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search categories by name, slug, or description..."
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

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
            >
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="most_products">Most Products</option>
            </select>
          </div>

        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-2 border-t border-gray-100">
          <span>Showing {filteredCategories.length} of {categories.length} categories</span>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('name_asc');
              }}
              className="text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* OPERATIONAL CATEGORIES TABLE */}
      {filteredCategories.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                {filteredCategories.map((cat) => {
                  const pCount = getCategoryProductCount(cat.id);
                  const isActive = cat.status !== 'inactive';

                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      
                      {/* Category Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl p-1 shrink-0 border border-gray-100 flex items-center justify-center">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                            ) : (
                              <Layers className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-gray-900 text-sm truncate max-w-xs">{cat.name}</h4>
                            <p className="text-[11px] text-gray-400 truncate max-w-xs">{cat.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-4 font-mono text-gray-600">
                        {cat.slug || cat.id}
                      </td>

                      {/* Derived Products Count */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-900 font-bold text-xs rounded-lg">
                          {pCount} {pCount === 1 ? 'product' : 'products'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-gray-400" />}
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-gray-500 font-medium">
                        {cat.createdAt || 'Aug 10, 2026'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Toggle Active/Inactive */}
                          <button
                            onClick={() => toggleCategoryStatus(cat.id)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={isActive ? 'Deactivate category' : 'Activate category'}
                          >
                            {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => navigate(`/admin/categories/${cat.id}/edit`)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Category"
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
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">No categories found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try changing your search keywords or status filter.
            </p>
          </div>
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Link>
        </div>
      )}

      {/* DELETE CONFIRMATION & PRODUCT PREVENT MODAL */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setDeletingCategory(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl z-10 space-y-4">
            {getCategoryProductCount(deletingCategory.id) > 0 ? (
              /* PREVENT DELETION MODAL WHEN PRODUCTS EXIST */
              <>
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Cannot delete category</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    This category contains <strong className="text-gray-900">{getCategoryProductCount(deletingCategory.id)} products</strong>. Remove or reassign products before deleting this category.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Link
                    to={`/admin/products?category=${deletingCategory.id}`}
                    onClick={() => setDeletingCategory(null)}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Products</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </>
            ) : (
              /* ALLOW DELETION WHEN ZERO PRODUCTS EXIST */
              <>
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Delete category?</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    This category will be permanently removed from your store navigation.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(deletingCategory)}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Delete Category
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
