import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Link2,
  Trash2
} from 'lucide-react';
import { createSupplierProductApi, uploadSupplierProductImageApi } from '../../services/supplierService';
import { fetchCategories } from '../../services/apiService';
import type { Category } from '../../types';
import type { SupplierProductRequest } from '../../types/supplier';

export const SupplierAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Image Upload State
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState<SupplierProductRequest>({
    name: '',
    sku: '',
    brand: '',
    description: '',
    shortDescription: '',
    price: 499,
    discountPrice: 399,
    stock: 25,
    lowStockThreshold: 5,
    image: '',
    categoryId: 1,
    status: 'ACTIVE',
    featured: false
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: Number(cats[0].id) }));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB.');
      return;
    }

    setUploadingImage(true);
    setUploadSuccess(false);
    setError('');

    try {
      const uploadedUrl = await uploadSupplierProductImageApi(file);
      setForm((prev) => ({ ...prev, image: uploadedUrl }));
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please check your network or try pasting a direct image URL.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Product title is required.');
      return;
    }
    if (!form.image.trim()) {
      setError('Please upload a product image or provide an image URL.');
      return;
    }
    if (form.price <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createSupplierProductApi(form);
      navigate('/supplier/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/supplier/products"
            className="p-2.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-2xl transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs text-gray-500">
              List a new item in your brand's storefront catalog with direct Cloudinary image upload.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs text-rose-600 font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Core Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nitro Max Running Shoes"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Puma, Nike, Apex"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom SKU (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={form.categoryId}
                disabled={loadingCats}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Short Catchphrase / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Ultra-light responsive foam running shoes"
                value={form.shortDescription || ''}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Product Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe material, specifications, warranty, dimensions, and unique advantages..."
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          {/* Right Column: Image Upload & Pricing */}
          <div className="space-y-4">
            
            {/* Image Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product Image *
                </label>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      imageMode === 'upload' ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      imageMode === 'url' ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Image URL
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {imageMode === 'upload' ? (
                /* Direct Upload Area */
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[140px] ${
                    dragActive
                      ? 'border-rose-500 bg-rose-50/50 scale-[1.01]'
                      : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100/70 hover:border-gray-300'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-7 h-7 text-rose-500 animate-spin" />
                      <span className="text-xs font-bold text-gray-700">Uploading to Cloudinary...</span>
                      <span className="text-[10px] text-gray-400">Optimizing resolution & generating CDN link</span>
                    </div>
                  ) : form.image ? (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Image Attached & Ready
                      </div>
                      <p className="text-[11px] text-gray-500">Click or drag a new image to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xs">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-gray-800">
                        Click to browse or drag & drop photo
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Supports PNG, JPG, WEBP • Auto-synced to Cloudinary CDN
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual URL Input */
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://res.cloudinary.com/... or image link"
                    value={form.image}
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.value });
                      setUploadSuccess(false);
                    }}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              )}

              {/* Live Image Preview Card */}
              {form.image && (
                <div className="mt-3 relative rounded-2xl border border-gray-200 bg-gray-50 p-2.5 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as any).src = 'https://placehold.co/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 truncate">Product Image</span>
                      {uploadSuccess && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                          Cloudinary CDN
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate font-mono mt-0.5">{form.image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, image: '' }));
                      setUploadSuccess(false);
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>


            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Retail Price (MRP ₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discountPrice || ''}
                  onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) || undefined })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Available Stock (Units) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Low Stock Alert Level
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.lowStockThreshold || 5}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured || false}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-500 h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Mark as Featured Product
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            to="/supplier/products"
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing listing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
