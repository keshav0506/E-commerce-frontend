import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Loader2, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { uploadProductImageApi } from '../../services/adminService';

export const AdminAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCategories: categories, createProduct } = useShop();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'beverages');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(24);
  const [badge, setBadge] = useState<string>('NEW LAUNCH');
  const [image, setImage] = useState('https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg');
  const [inStock, setInStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImageApi(file);
      if (uploadedUrl) {
        setImage(uploadedUrl);
      }
    } catch (err) {
      console.warn('Image upload notice:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Product name is required.';
    if (!description.trim()) errs.description = 'Product description is required.';
    if (!categoryId) errs.categoryId = 'Please select a category.';
    if (price === '' || Number(price) <= 0) errs.price = 'Price must be greater than 0.';
    if (originalPrice !== '' && Number(originalPrice) < Number(price)) {
      errs.originalPrice = 'Original price cannot be less than current price.';
    }
    if (stock < 0) errs.stock = 'Stock cannot be negative.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const currentPriceNum = Number(price);
    const origPriceNum = originalPrice !== '' ? Number(originalPrice) : currentPriceNum;
    const discount = origPriceNum > currentPriceNum ? Math.round(((origPriceNum - currentPriceNum) / origPriceNum) * 100) : 0;
    const selectedCategoryObj = categories.find((c) => c.id === categoryId);

    setTimeout(() => {
      createProduct({
        name: name.trim(),
        categoryId,
        categoryName: selectedCategoryObj?.name || 'Beverages',
        price: currentPriceNum,
        originalPrice: origPriceNum,
        discountPercent: discount,
        rating: 4.8,
        reviewCount: 12,
        image: image.trim() || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg',
        images: [image.trim() || 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg'],
        badge: badge.trim() || undefined,
        description: description.trim(),
        inStock: inStock && stock > 0,
        stock,
        specifications: [
          { key: 'Brand', value: brand.trim() || 'Shoply Brand' },
          { key: 'Category', value: selectedCategoryObj?.name || 'General' },
          { key: 'SKU', value: sku.trim() || `SKU-${Date.now()}` }
        ]
      });

      setIsSubmitting(false);
      navigate('/admin/products');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left pb-12">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-gray-500 mb-2">
        <Link to="/admin" className="hover:text-rose-600">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/admin/products" className="hover:text-rose-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-extrabold">New Product</span>
      </nav>

      {/* PAGE HEADER BANNER */}
      <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              New SKU Form
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create a new merchandise listing with pricing, stock levels, specifications, and category.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl border border-gray-200/80 shadow-2xs self-start sm:self-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MAIN PRODUCT INFO */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Basic Product Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Berry Blast Organic Juice 500ml"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
              />
              {errors.name && <p className="text-xs text-rose-500 font-bold mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border border-gray-200/80 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer shadow-2xs"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Berry Fresh"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  placeholder="SKU-1024"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 shadow-2xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Product Description *
              </label>
              <textarea
                rows={4}
                placeholder="Write a compelling, detailed product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs leading-relaxed"
              />
              {errors.description && <p className="text-xs text-rose-500 font-bold mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-500" />
              <span>Product Image Asset</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Upload Image or Enter URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 shadow-2xs"
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold transition-colors shrink-0 border border-gray-200/80 hover:border-rose-200 shadow-2xs">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200/80 rounded-2xl flex items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 bg-[#f3f4f6] rounded-xl p-2 border border-gray-200/70 shrink-0 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div>
                <span className="text-xs font-extrabold text-gray-900 block">Catalog Card Preview</span>
                <span className="text-[11px] text-gray-400">Live preview of how the item thumbnail will render in the customer catalog.</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PRICING & INVENTORY */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Pricing & Discounts
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Current Sale Price (₹) *
              </label>
              <input
                type="number"
                placeholder="199"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-black text-gray-900 shadow-2xs"
              />
              {errors.price && <p className="text-xs text-rose-500 font-bold mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Original MRP Price (₹)
              </label>
              <input
                type="number"
                placeholder="249"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-bold text-gray-900 shadow-2xs"
              />
              {errors.originalPrice && <p className="text-xs text-rose-500 font-bold mt-1">{errors.originalPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Badge Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 20% OFF or NEW LAUNCH"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-900 shadow-2xs"
              />
            </div>
          </div>

          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/70 pb-3">
              Inventory & Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1.5">
                Available Stock Units
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs font-bold text-gray-900 shadow-2xs"
              />
            </div>

            <label className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs cursor-pointer">
              <span className="text-xs font-extrabold text-gray-900">Active On Storefront</span>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-500 h-5 w-5"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Product...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Product to Store</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
