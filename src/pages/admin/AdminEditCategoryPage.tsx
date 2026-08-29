import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Loader2, Image as ImageIcon, Save, Layers } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminEditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, updateCategory } = useShop();

  const category = categories.find((c) => c.id === id || c.slug === id);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug || category.id);
      setDescription(category.description || '');
      setImage(category.image || '');
      setStatus(category.status || 'active');
    }
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="bg-[#f3f4f6] rounded-3xl p-10 max-w-md w-full border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
            <Layers className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Category Not Found</h2>
          <p className="text-xs text-gray-500">
            The category you are trying to edit does not exist or may have been removed.
          </p>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Categories</span>
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Category name is required.';

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      errs.slug = 'Slug is required.';
    } else {
      const exists = categories.some((c) => c.id !== category.id && (c.slug === cleanSlug || c.id === `cat-${cleanSlug}`));
      if (exists) {
        errs.slug = 'Slug already exists. Please choose a unique slug.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const cleanSlug = slug.trim().toLowerCase();

    setTimeout(() => {
      updateCategory(category.id, {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        image: image.trim() || category.image,
        status
      });

      setIsSubmitting(false);
      navigate('/admin/categories');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left pb-12">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-2">
        <Link to="/admin" className="hover:text-rose-600">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/admin/categories" className="hover:text-rose-600">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-extrabold truncate max-w-xs">{category.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              Department Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Edit Category
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Update category name, department slug, thumbnail image, and store visibility.
          </p>
        </div>

        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl border border-gray-200/80 shadow-2xs self-start sm:self-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#f3f4f6] rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
            />
            {errors.name && <p className="text-xs text-rose-500 font-bold mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
              Category Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
            />
            {errors.slug && <p className="text-xs text-rose-500 font-bold mt-1">{errors.slug}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
          />
        </div>

        {/* Image & Preview */}
        <div className="space-y-3 pt-4 border-t border-gray-200/70">
          <label className="block text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-rose-500" />
            <span>Category Image URL / Preset Path</span>
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 shadow-2xs"
          />

          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl flex items-center gap-4 shadow-2xs">
            <div className="w-14 h-14 bg-[#f3f4f6] rounded-xl p-2 border border-gray-200/70 shrink-0 flex items-center justify-center">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">Thumbnail Preview</span>
              <span className="text-[11px] text-gray-400">Preview of the category thumbnail on store pages.</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-gray-200/70">
          <label className="block text-xs font-bold text-gray-800 uppercase mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 text-xs font-extrabold text-gray-900 cursor-pointer bg-white px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <input
                type="radio"
                name="categoryStatus"
                checked={status === 'active'}
                onChange={() => setStatus('active')}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Active (Visible in Store)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-extrabold text-gray-900 cursor-pointer bg-white px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <input
                type="radio"
                name="categoryStatus"
                checked={status === 'inactive'}
                onChange={() => setStatus('inactive')}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Inactive (Hidden from Store Navigation)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200/70">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-rose-200 flex items-center gap-2 transition-all cursor-pointer transform active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl border border-gray-200/80 shadow-2xs cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>
  );
};
