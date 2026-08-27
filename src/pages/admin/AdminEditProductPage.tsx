import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Loader2, Image as ImageIcon, Save, Package, Upload } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { uploadProductImageApi } from '../../services/adminService';

export const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, updateProduct } = useShop();

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(24);
  const [badge, setBadge] = useState<string>('');
  const [image, setImage] = useState('');
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

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategoryId(product.categoryId);
      const brandSpec = product.specifications?.find((s) => s.key === 'Brand')?.value || '';
      const skuSpec = product.specifications?.find((s) => s.key === 'SKU')?.value || `SKU-${product.id.slice(-6).toUpperCase()}`;
      setBrand(brandSpec);
      setSku(skuSpec);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice);
      setStock(product.stock || 24);
      setBadge(product.badge || '');
      setImage(product.image);
      setInStock(product.inStock);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-gray-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Product Not Found</h2>
          <p className="text-xs text-gray-500">
            The product you are trying to edit does not exist or may have been removed.
          </p>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

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
      updateProduct(product.id, {
        name: name.trim(),
        categoryId,
        categoryName: selectedCategoryObj?.name || product.categoryName,
        price: currentPriceNum,
        originalPrice: origPriceNum,
        discountPercent: discount,
        image: image.trim() || product.image,
        images: [image.trim() || product.image],
        badge: badge.trim() || undefined,
        description: description.trim(),
        inStock: inStock && stock > 0,
        stock,
        specifications: [
          { key: 'Brand', value: brand.trim() || 'Shoply Brand' },
          { key: 'Category', value: selectedCategoryObj?.name || product.categoryName },
          { key: 'SKU', value: sku.trim() || `SKU-${product.id.slice(-6).toUpperCase()}` }
        ]
      });

      setIsSubmitting(false);
      navigate('/admin/products');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-2">
        <Link to="/admin" className="hover:text-rose-600">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/admin/products" className="hover:text-rose-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Edit Product
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Update product details for <strong className="text-gray-800">{product.name}</strong>.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              Basic Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.name && <p className="text-xs text-rose-500 font-bold mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.description && <p className="text-xs text-rose-500 font-bold mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-rose-500" />
              <span>Product Image Media</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Upload Image or Enter URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold transition-colors shrink-0 border border-rose-200">
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

            <div className="p-4 bg-[#f8f9fa] border border-gray-100 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl p-2 border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Image Preview</span>
                <span className="text-[11px] text-gray-400">Live preview of the product image.</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              Pricing & Discounts
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Current Sale Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900"
              />
              {errors.price && <p className="text-xs text-rose-500 font-bold mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900"
              />
              {errors.originalPrice && <p className="text-xs text-rose-500 font-bold mt-1">{errors.originalPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Badge Tag
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
              Inventory & Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900"
              />
            </div>

            <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
              <span className="text-xs font-bold text-gray-900">Active Status</span>
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
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
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
          </div>

        </div>

      </form>

    </div>
  );
};
