import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  MessageSquarePlus,
  Trash2,
  Edit3,
  X,
  Loader2,
  CheckCircle2,
  ImagePlus,
  Camera,
  Building2,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Send,
  Info
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { fetchEmiPlans } from '../services/apiService';
import {
  fetchProductReviewsApi,
  submitProductReviewApi,
  deleteProductReviewApi,
  uploadReviewImageApi,
} from '../services/reviewService';
import type { ProductReviewsSummary } from '../services/reviewService';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist, showToast, startInstantCheckout } = useShop();
  const { user, isLoggedIn } = useAuth();

  const product = products.find((p) => p.id === id);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // HATEOAS States: EMI Calculator, Expandable Info, Bulk Quote
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [emiData, setEmiData] = useState<any>(null);
  const [isEmiLoading, setIsEmiLoading] = useState(false);
  const [selectedEmiBank, setSelectedEmiBank] = useState<string>('All');
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteQty, setQuoteQty] = useState('100');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Reviews state
  const [reviewSummary, setReviewSummary] = useState<ProductReviewsSummary | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  // Review images stored as Cloudinary CDN URLs (uploaded via backend)
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImageIdx, setUploadingImageIdx] = useState<number | null>(null); // index being replaced, or -1 for new
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageIndexRef = useRef<number | null>(null);

  const handleOpenEmiModal = async () => {
    setIsEmiModalOpen(true);
    if (!emiData && product?.id) {
      setIsEmiLoading(true);
      try {
        const res = await fetchEmiPlans(product.id);
        setEmiData(res);
      } catch (e) {
        console.error('Failed to load EMI plans:', e);
      } finally {
        setIsEmiLoading(false);
      }
    }
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    setTimeout(() => {
      setIsSubmittingQuote(false);
      setIsQuoteModalOpen(false);
      setQuoteNotes('');
      const suppName = product?.supplier?.businessName || `${product?.categoryName || ''} Supplier`;
      showToast(`Wholesale inquiry sent to ${suppName}!`);
    }, 700);
  };

  // Load reviews for current product
  const loadReviews = async (targetId?: string) => {
    const reviewId = targetId || id;
    if (!reviewId) return;
    try {
      setIsReviewLoading(true);
      const data = await fetchProductReviewsApi(reviewId);
      setReviewSummary(data);
    } catch (err) {
      console.warn('Failed to load reviews:', err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setQuantity(1);
    setPincodeResult(null);
    if (product?.volumes && product.volumes.length > 0) {
      setSelectedVolume(product.volumes[0]);
    }
  }, [id, product, isLoggedIn]);

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
  const isWishlisted = wishlist.some((id) => String(id) === String(product.id));

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
    startInstantCheckout(product, quantity, activeVolume);
    navigate('/checkout?instant=true');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 5) {
      setPincodeResult('Please enter a valid 6-digit pincode.');
      return;
    }
    setPincodeResult(`Delivery available in 2 days to ${pincode} (Free Express Shipping)`);
  };

  // Review modal open handler
  const handleOpenReviewModal = () => {
    if (!isLoggedIn) {
      showToast('Please sign in to write a review');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    if (reviewSummary?.userReview) {
      setRatingInput(reviewSummary.userReview.rating);
      setTitleInput(reviewSummary.userReview.title);
      setCommentInput(reviewSummary.userReview.comment);
      // Restore existing review images if they exist (stored in userReview.images)
      const existing = (reviewSummary.userReview as any).images;
      if (Array.isArray(existing)) {
        setReviewImages(existing);
      } else if (typeof existing === 'string' && existing.trim()) {
        try {
          const parsed = JSON.parse(existing);
          setReviewImages(Array.isArray(parsed) ? parsed : [existing]);
        } catch {
          setReviewImages(existing.includes(',') ? existing.split(',').map((s: string) => s.trim()) : [existing]);
        }
      } else {
        setReviewImages([]);
      }
    } else {
      setRatingInput(5);
      setTitleInput('');
      setCommentInput('');
      setReviewImages([]);
    }
    setIsReviewModalOpen(true);
  };

  // Handle image file selection — upload to Cloudinary via backend, store CDN URL
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const replaceIdx = replaceImageIndexRef.current;
    replaceImageIndexRef.current = null;
    e.target.value = '';

    const filesToUpload = files.slice(0, replaceIdx !== null ? 1 : 4 - reviewImages.length);

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed');
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image must be under 10 MB');
        continue;
      }

      try {
        // Show uploading spinner at the right slot
        setUploadingImageIdx(replaceIdx !== null ? replaceIdx : -1);
        const cloudUrl = await uploadReviewImageApi(file);

        if (replaceIdx !== null) {
          setReviewImages((prev) => {
            const updated = [...prev];
            updated[replaceIdx] = cloudUrl;
            return updated;
          });
        } else {
          setReviewImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, cloudUrl];
          });
        }
      } catch (err: any) {
        showToast(err?.message || 'Failed to upload image. Please try again.');
      } finally {
        setUploadingImageIdx(null);
      }
    }
  };

  const handleRemoveImage = (idx: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReplaceImage = (idx: number) => {
    replaceImageIndexRef.current = idx;
    imageInputRef.current?.click();
  };

  // Submit review handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      showToast('Please write a comment for your review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await submitProductReviewApi(product.id, {
        rating: ratingInput,
        title: titleInput.trim() || 'Great product!',
        comment: commentInput.trim(),
        images: reviewImages,
      });
      showToast('Thank you! Your review has been submitted. 🎉');
      setIsReviewModalOpen(false);
      setReviewImages([]);
      // Reload reviews and scroll to the reviews section - DON'T navigate away
      await loadReviews(product.id);
      setTimeout(() => {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      showToast(err?.message || err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Delete review handler
  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await deleteProductReviewApi(product.id);
      showToast('Your review has been removed');
      loadReviews(product.id);
    } catch (err: any) {
      showToast(err?.message || err?.response?.data?.message || 'Failed to delete review');
    }
  };

  // Compute live review ratings and distributions
  const displayRating = reviewSummary?.averageRating || product.rating || 4.8;
  const displayReviewCount = reviewSummary?.totalReviews !== undefined ? reviewSummary.totalReviews : (product.reviewCount || 1);
  const displayReviews = reviewSummary?.reviews && reviewSummary.reviews.length > 0 ? reviewSummary.reviews : (product.reviews || []);

  const ratingPercentages = reviewSummary?.ratingPercentages || {
    5: 75,
    4: 20,
    3: 5,
    2: 0,
    1: 0
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center space-x-2 text-xs font-medium text-gray-500 mb-6">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-rose-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* TOP SECTION: GALLERY + DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY (5 COLS) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-[#f3f4f6] rounded-3xl border border-gray-200/80 p-6 flex items-center justify-center shadow-xs overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={galleryImages[selectedImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply"
                />
              </AnimatePresence>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                  isWishlisted ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-200/70 shadow-xs'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Discount Tag */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-2xl bg-[#f3f4f6] border-2 p-1.5 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-rose-500 ring-2 ring-rose-100'
                        : 'border-gray-200/80 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS (7 COLS) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                  {product.categoryId ? `Category #${product.categoryId}` : 'Featured'}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">SKU: SHP-{product.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* HATEOAS Category Supplier Banner & Wholesale CTAs */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Link
                  to={`/supplier-store/${product.supplier?.id || 1}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-700 text-xs font-bold transition-all shadow-2xs group"
                >
                  <Building2 className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span>Get more from {product.supplier?.businessName || `${product.categoryName || 'Category'} Supplier`}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Wholesale Inquiry</span>
                </button>
              </div>

              {/* Rating Preview */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full text-amber-900 text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{displayRating}</span>
                </div>
                <a href="#reviews-section" className="text-xs text-gray-500 hover:text-rose-600 underline font-medium">
                  {displayReviewCount} customer {displayReviewCount === 1 ? 'review' : 'reviews'}
                </a>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 sm:p-5 bg-[#f3f4f6] border border-gray-200/80 rounded-3xl shadow-xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-sm font-bold text-rose-500">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium block">Inclusive of all taxes & doorstep delivery</span>

              {/* HATEOAS EMI Financing Breakdown Bar */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60 mt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <CreditCard className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    EMI from <strong className="text-gray-900 font-black">₹{Math.round(product.price / 12)}/mo</strong> • No Cost EMI Available
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEmiModal}
                  className="inline-flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  <span>View Plans</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Sizes / Volumes selection */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Size / Variant:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.volumes.map((vol) => (
                    <button
                      key={vol}
                      onClick={() => setSelectedVolume(vol)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedVolume === vol
                          ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-200'
                          : 'bg-[#f3f4f6] text-gray-700 border border-gray-200/80 hover:border-gray-300'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add to Cart + Buy Now Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200/80 rounded-2xl p-1 bg-[#f3f4f6]">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Add {quantity} to Cart • ₹{product.price * quantity}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-gray-200 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Instant Checkout • ₹{product.price * quantity}</span>
              </button>
            </div>

            {/* Pincode checker */}
            <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-2xl p-4 shadow-xs space-y-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                Check Delivery Availability
              </span>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-hidden focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-center space-y-1 shadow-xs">
                <Truck className="w-5 h-5 text-rose-500 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">Fast Shipping</span>
                <span className="text-[10px] text-gray-400 block">2-3 business days</span>
              </div>
              <div className="p-3 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-center space-y-1 shadow-xs">
                <RotateCcw className="w-5 h-5 text-rose-500 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">7 Days Return</span>
                <span className="text-[10px] text-gray-400 block">Easy replacements</span>
              </div>
              <div className="p-3 bg-[#f3f4f6] border border-gray-200/80 rounded-2xl text-center space-y-1 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-rose-500 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">100% Genuine</span>
                <span className="text-[10px] text-gray-400 block">Verified Brand</span>
              </div>
            </div>

          </div>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <section className="py-12 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">About this product</h2>
            <button
              onClick={() => setIsMoreInfoExpanded(!isMoreInfoExpanded)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer border border-rose-200/80"
            >
              <Info className="w-3.5 h-3.5 text-rose-500" />
              <span>{isMoreInfoExpanded ? 'See Less Info' : 'See More Info (Specifications & Origin)'}</span>
              {isMoreInfoExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-rose-500" />
              )}
            </button>
          </div>

          <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
              {product.description || 'Experience the highest standard of craftsmanship and performance. Designed with precision, this product delivers superior quality, enhanced durability, and modern aesthetics tailored for your everyday lifestyle.'}
            </p>

            {/* EXPANDABLE HATEOAS DEEP INFO ACCORDION */}
            <AnimatePresence>
              {isMoreInfoExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pt-4 border-t border-gray-200/70 space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Authorized Supplier
                      </span>
                      <p className="text-xs font-bold text-gray-900">
                        {product.supplier?.businessName || `${product.categoryName} Supplier`}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {product.supplier?.businessEmail || `${(product.categoryName || 'cat').toLowerCase().replace(/\s+/g, '')}Supplier@shoply.com`}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Country of Origin
                      </span>
                      <p className="text-xs font-bold text-gray-900">Made in India (100% Verified)</p>
                      <p className="text-[11px] text-gray-500">Meets national BIS & ISO 9001 quality marks</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Manufacturer Warranty
                      </span>
                      <p className="text-xs font-bold text-gray-900">12 Months Direct Warranty</p>
                      <p className="text-[11px] text-gray-500">Covers defects with free doorstep pickup</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Material & Packaging
                      </span>
                      <p className="text-xs font-bold text-gray-900">Eco-Friendly Recyclable Packaging</p>
                      <p className="text-[11px] text-gray-500">BPA-Free, Non-toxic & certified compliant</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Return & Exchange Policy
                      </span>
                      <p className="text-xs font-bold text-gray-900">7-Day Hassle-Free Returns</p>
                      <p className="text-[11px] text-gray-500">Instant full refund on unboxing damage</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Care & Storage Guidelines
                      </span>
                      <p className="text-xs font-bold text-gray-900">Store in a cool & dry environment</p>
                      <p className="text-[11px] text-gray-500">Keep away from direct heat or prolonged moisture</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-rose-50/70 border border-rose-200/60 rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-rose-700">
                      <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-semibold">
                        Want wholesale procurement or custom volume pricing for this SKU?
                      </span>
                    </div>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-[11px] transition-all shadow-xs cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* PRODUCT SPECIFICATIONS */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
            <div className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                {product.specifications.map((spec, idx) => (
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
        )}

        {/* CUSTOMER REVIEWS & RATINGS */}
        <section id="reviews-section" className="py-12 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Customer Reviews & Ratings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Real feedback from verified purchasers</p>
            </div>

            <button
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{reviewSummary?.userHasReviewed ? 'Edit Your Review' : 'Write a Review'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* RATING SUMMARY CARD */}
            <div className="lg:col-span-4 bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 shadow-xs text-center space-y-4">
              <div>
                <span className="text-5xl font-black text-gray-900">{displayRating}</span>
                <span className="text-sm text-gray-400 block font-medium mt-1">out of 5.0</span>
              </div>

              <div className="flex justify-center text-amber-400 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(displayRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-100 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-gray-500 block font-medium">
                Based on {displayReviewCount} {displayReviewCount === 1 ? 'rating' : 'ratings'}
              </span>

              {/* STAR BREAKDOWN BARS */}
              <div className="space-y-2 pt-2 text-xs">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = ratingPercentages[stars] || 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-8 text-right font-bold text-gray-700">{stars}★</span>
                      <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-gray-200/60">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-left text-gray-400 font-semibold">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="lg:col-span-8 space-y-4">
              {isReviewLoading ? (
                <div className="bg-[#f3f4f6] rounded-3xl p-8 border border-gray-200/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                </div>
              ) : displayReviews.length === 0 ? (
                <div className="bg-[#f3f4f6] rounded-3xl p-8 border border-gray-200/80 text-center space-y-3">
                  <p className="text-sm font-bold text-gray-800">No customer reviews yet</p>
                  <p className="text-xs text-gray-400">Be the first to share your experience with this product!</p>
                  <button
                    onClick={handleOpenReviewModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write First Review</span>
                  </button>
                </div>
              ) : (
                displayReviews.map((rev: any) => {
                  const reviewId = rev.id;
                  const reviewAuthor = rev.userName || 'Customer';
                  const reviewRatingNum = rev.rating || rev.userRating || 5;
                  const reviewDate = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : (rev.date || 'Recent');
                  const isOwner = rev.owner || (user && rev.userEmail === user.email);

                  return (
                    <div key={reviewId} className="bg-[#f3f4f6] border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {reviewAuthor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-gray-900">{reviewAuthor}</span>
                              {(rev.verifiedPurchase || rev.verified) && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400">{reviewDate}</span>
                          </div>
                        </div>

                        {/* Owner Edit / Delete Controls */}
                        {isOwner && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleOpenReviewModal}
                              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Edit Review"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleDeleteReview}
                              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex text-amber-400 space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= reviewRatingNum
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-100 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Title & Comment */}
                      {rev.title && (
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{rev.title}</h4>
                      )}
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {/* Review Images */}
                      {(() => {
                        const itemImages: string[] = Array.isArray(rev.images)
                          ? rev.images
                          : typeof rev.images === 'string' && rev.images.trim()
                          ? (() => {
                              try {
                                const parsed = JSON.parse(rev.images);
                                return Array.isArray(parsed) ? parsed : [rev.images];
                              } catch {
                                return rev.images.includes(',') ? rev.images.split(',').map((s: string) => s.trim()) : [rev.images];
                              }
                            })()
                          : [];

                        if (itemImages.length === 0) return null;

                        return (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {itemImages.map((imgSrc: string, imgIdx: number) => (
                              <button
                                key={imgIdx}
                                type="button"
                                onClick={() => setLightboxImage(imgSrc)}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-rose-300 transition-all cursor-pointer shadow-xs hover:scale-105"
                              >
                                <img
                                  src={imgSrc}
                                  alt={`Review photo ${imgIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })
              )}
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

      {/* WRITE / EDIT REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <MessageSquarePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      {reviewSummary?.userHasReviewed ? 'Update Your Review' : 'Write a Customer Review'}
                    </h3>
                    <p className="text-[11px] text-gray-400">{product.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRatingInput(star)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || ratingInput)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'fill-gray-100 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      {(hoverRating || ratingInput)} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Headline / Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent build quality and fast shipping!"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What did you like or dislike? What did you use this product for?"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                {/* Review Images Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    Add Photos
                    <span className="text-gray-400 font-normal normal-case">(optional, up to 4)</span>
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageFileSelect}
                  />

                  <div className="flex flex-wrap gap-2">
                    {/* Existing image previews */}
                    {reviewImages.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer"
                        onClick={() => setLightboxImage(src)}
                      >
                        <img src={src} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
                        {/* Upload spinner for replace */}
                        {uploadingImageIdx === idx && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
                          </div>
                        )}
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleReplaceImage(idx); }}
                            className="w-7 h-7 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                            title="Replace image"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                            className="w-7 h-7 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Image number badge */}
                        <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/60 text-white text-[9px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>
                    ))}

                    {/* Upload spinner for new image slot */}
                    {uploadingImageIdx === -1 && (
                      <div className="w-20 h-20 rounded-xl border-2 border-rose-200 bg-rose-50 flex flex-col items-center justify-center gap-1">
                        <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
                        <span className="text-[9px] font-bold text-rose-500">Uploading...</span>
                      </div>
                    )}

                    {/* Add photo button — hidden while uploading */}
                    {reviewImages.length < 4 && uploadingImageIdx === null && (
                      <button
                        type="button"
                        onClick={() => {
                          replaceImageIndexRef.current = null;
                          imageInputRef.current?.click();
                        }}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-rose-400 hover:bg-rose-50/50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-rose-500 transition-all cursor-pointer"
                      >
                        <ImagePlus className="w-5 h-5" />
                        <span className="text-[9px] font-bold">
                          {reviewImages.length === 0 ? 'Add Photo' : `Add More`}
                        </span>
                      </button>
                    )}
                  </div>

                  {reviewImages.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Hover over a photo to replace or remove it. Click to enlarge.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || uploadingImageIdx !== null}
                    className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : uploadingImageIdx !== null ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading photo...</span>
                      </>
                    ) : (
                      <span>{reviewSummary?.userHasReviewed ? 'Update Review' : 'Submit Review'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMAGE LIGHTBOX - full screen image viewer */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative z-10 max-w-2xl w-full"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={lightboxImage}
                alt="Review photo"
                className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* EMI FINANCING MODAL */}
      <AnimatePresence>
        {isEmiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-rose-500 shadow-2xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">EMI & Instant Financing Plans</h3>
                    <p className="text-[11px] text-gray-500">
                      Product Price: <strong className="text-gray-900 font-extrabold">₹{product.price}</strong> • No Cost EMI Available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmiModalOpen(false)}
                  className="p-2 rounded-xl bg-white text-gray-400 hover:text-gray-700 shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bank Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'HDFC Bank', 'ICICI Bank', 'State Bank of India (SBI)', 'Axis Bank', 'Kotak Mahindra Bank'].map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedEmiBank(bank)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedEmiBank === bank
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>

              {/* Plan Cards Grid */}
              {isEmiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                  <span className="text-xs font-bold">Calculating real-time bank tenures...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {(emiData?.plans || [
                    { bankName: 'HDFC Bank', tenureMonths: 3, monthlyInstallment: Math.round(product.price / 3), interestRate: 0, totalPayable: product.price, isNoCost: true },
                    { bankName: 'HDFC Bank', tenureMonths: 6, monthlyInstallment: Math.round(product.price / 6), interestRate: 0, totalPayable: product.price, isNoCost: true },
                    { bankName: 'ICICI Bank', tenureMonths: 3, monthlyInstallment: Math.round(product.price / 3), interestRate: 0, totalPayable: product.price, isNoCost: true },
                    { bankName: 'ICICI Bank', tenureMonths: 6, monthlyInstallment: Math.round(product.price / 6), interestRate: 0, totalPayable: product.price, isNoCost: true },
                    { bankName: 'State Bank of India (SBI)', tenureMonths: 6, monthlyInstallment: Math.round(product.price * 1.06 / 6), interestRate: 13.5, totalPayable: Math.round(product.price * 1.06), isNoCost: false },
                    { bankName: 'Axis Bank', tenureMonths: 9, monthlyInstallment: Math.round(product.price * 1.1 / 9), interestRate: 14.5, totalPayable: Math.round(product.price * 1.1), isNoCost: false },
                    { bankName: 'Kotak Mahindra Bank', tenureMonths: 12, monthlyInstallment: Math.round(product.price * 1.15 / 12), interestRate: 15.0, totalPayable: Math.round(product.price * 1.15), isNoCost: false }
                  ])
                    .filter((p: any) => selectedEmiBank === 'All' || p.bankName === selectedEmiBank)
                    .map((plan: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-300 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-gray-900">{plan.bankName}</span>
                            {plan.isNoCost ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                0% No Cost EMI
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                                {plan.interestRate}% p.a.
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400">
                            {plan.tenureMonths} Months tenure • Total Payable: ₹{plan.totalPayable}
                          </p>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="text-sm font-black text-rose-600">
                            ₹{plan.monthlyInstallment}/mo
                          </span>
                          <span className="text-[10px] text-gray-400 block font-medium">Standard Processing</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Explanatory Box */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200/70 shadow-2xs space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>How No Cost EMI Works</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  With No Cost EMI, the total interest charged by the bank is offered as an upfront instant discount by Shoply, making your net financing cost exactly equal to the cash price.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsEmiModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHOLESALE QUOTE MODAL */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-rose-500 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Request Wholesale Quotation</h3>
                    <p className="text-[11px] text-gray-400">
                      Supplier: {product.supplier?.businessName || `${product.categoryName} Supplier`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2 rounded-xl bg-white text-gray-400 hover:text-gray-700 shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendQuote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                    Required Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={quoteQty}
                    onChange={(e) => setQuoteQty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase mb-1">
                    Requirements / Special Inquiries
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify delivery timeline, custom labelling, target invoice price..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                  />
                </div>

                <div className="p-3 bg-white rounded-2xl border border-gray-200/60 shadow-2xs text-[11px] text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Your request will be dispatched to {product.supplier?.businessEmail || `${(product.categoryName || 'supplier').toLowerCase().replace(/\s+/g, '')}Supplier@shoply.com`}.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingQuote ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Quotation Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
