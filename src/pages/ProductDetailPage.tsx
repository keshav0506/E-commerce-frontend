import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Check,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist, setIsCartOpen } = useShop();

  const product = products.find((p) => p.id === id);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setQuantity(1);
    setPincodeResult(null);
    if (product?.volumes && product.volumes.length > 0) {
      setSelectedVolume(product.volumes[0]);
    }
  }, [id, product]);

  // Handle Invalid Product ID State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-gray-100 shadow-lg space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Product Not Found</h2>
          <p className="text-xs text-gray-500">
            The product you are looking for does not exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeVolume = selectedVolume || product.volumes?.[0] || 'Standard';
  const isWishlisted = wishlist.includes(product.id);

  // Related products from same category (excluding current)
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const displayRelatedProducts =
    relatedProducts.length >= 4
      ? relatedProducts
      : [...relatedProducts, ...products.filter((p) => p.id !== product.id)].slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeVolume);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, activeVolume);
    setIsCartOpen(true);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 5) {
      setPincodeResult('Please enter a valid 6-digit pincode.');
      return;
    }
    setPincodeResult(`Delivery available in 2 days to ${pincode} (Free Express Shipping)`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center space-x-2 text-xs font-medium text-gray-500 mb-6">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/products" className="hover:text-rose-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to={`/products?category=${product.categoryId}`} className="hover:text-rose-600 transition-colors">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* MAIN 2-COLUMN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-gray-100">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-[#f8f9fa] border border-gray-100 rounded-3xl p-8 aspect-square flex items-center justify-center overflow-hidden shadow-xs">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 shadow-md'
                    : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white shadow-xs'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={galleryImages[selectedImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain filter drop-shadow-xl mix-blend-multiply hover:scale-105 transition-transform duration-500 max-h-[420px]"
                />
              </AnimatePresence>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 bg-slate-50/50 rounded-2xl p-2 border transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-rose-500 ring-2 ring-rose-500/20 scale-105'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO & ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                {product.categoryName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mt-2.5">
                <div className="flex items-center bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-amber-600 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
                <a href="#reviews-section" className="text-xs font-semibold text-gray-500 hover:text-rose-600 underline">
                  ({product.reviewCount} customer reviews)
                </a>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <span className="text-3xl font-black text-gray-900">
                ₹{product.price}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}

              {product.discountPercent > 0 && (
                <span className="text-xs font-bold text-white bg-rose-500 px-2.5 py-1 rounded-lg shadow-xs">
                  SAVE {product.discountPercent}%
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                About this product
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.volumes && product.volumes.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-900 block mb-2">Select Size / Volume</span>
                <div className="flex flex-wrap gap-2">
                  {product.volumes.map((vol) => (
                    <button
                      key={vol}
                      onClick={() => setSelectedVolume(vol)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        activeVolume === vol
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ₹{product.price * quantity}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer transform active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Free delivery &gt; ₹499</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>14 day returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>100% secure payment</span>
                </div>
              </div>

              <form onSubmit={handleCheckPincode} className="pt-2 border-t border-gray-200/60">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Check Delivery Location
                </span>
                <div className="flex max-w-sm">
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-l-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-r-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {pincodeResult && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {pincodeResult}
                  </p>
                )}
              </form>
            </div>

          </div>

        </div>

        {/* SPECIFICATIONS */}
        <section className="py-12 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>Product Specifications</span>
          </h2>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {product.specifications?.map((spec, idx) => (
                <div key={idx} className="border-b sm:border-b-0 pb-3 sm:pb-0">
                  <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">
                    {spec.key}
                  </span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews-section" className="py-12 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-center space-y-4">
              <div>
                <span className="text-5xl font-black text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-400 block font-medium mt-1">out of 5.0</span>
              </div>

              <div className="flex justify-center text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <span className="text-xs text-gray-500 block font-medium">
                Based on {product.reviewCount} verified ratings
              </span>

              <div className="space-y-2 pt-2 text-xs">
                {product.ratingDistribution?.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-2">
                    <span className="w-8 text-right font-bold text-gray-700">{dist.stars}★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${dist.percentage}%` }} />
                    </div>
                    <span className="w-8 text-left text-gray-400">{dist.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {product.reviews?.map((rev) => (
                <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{rev.userName}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified Purchase
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 space-x-0.5">
                    {[...Array(rev.userRating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              You May Also Like
            </h2>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              View All Products &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayRelatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </section>

      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex items-center gap-3 shadow-2xl">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Buy Now • ₹{product.price * quantity}</span>
        </button>
      </div>

    </div>
  );
};
