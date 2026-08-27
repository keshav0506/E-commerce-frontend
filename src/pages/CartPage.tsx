import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
  Truck,
  Heart,
  Tag,
  Check,
  X,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotalCount,
    cartSubtotal,
    cartProductDiscount,
    cartDeliveryFee,
    appliedCoupon,
    couponDiscountAmount,
    cartFinalTotal,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    wishlist
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-28 sm:pb-24 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-3 sm:mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="pb-4 sm:pb-6 border-b border-gray-100 mb-4 sm:mb-6 flex flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Your Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review your items before proceeding to checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <span className="text-[11px] sm:text-xs font-bold text-rose-600 bg-rose-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-rose-100 shrink-0">
              {cartTotalCount} {cartTotalCount === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 sm:my-12 border border-gray-100 shadow-xs space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Your cart is empty</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Looks like you haven't added anything yet. Explore our fresh collection to get started!
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* TWO-COLUMN RESPONSIVE CART LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
            
            {/* LEFT COLUMN: ITEMS & COUPONS */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              
              {/* Free Delivery Progress Card */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1.5">
                  <span className="flex items-center gap-1.5 truncate pr-2">
                    <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-extrabold truncate">You unlocked Free Delivery!</span>
                    ) : (
                      <span className="truncate">Add ₹{freeShippingThreshold - cartSubtotal} more for Free Delivery</span>
                    )}
                  </span>
                  <span className="shrink-0">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 sm:space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => {
                    const isWishlisted = wishlist.includes(item.product.id);

                    return (
                      <motion.div
                        key={`${item.product.id}-${item.selectedVolume}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
                      >
                        {/* Top: Product Thumbnail & Title/Price Info */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <Link
                            to={`/products/${item.product.id}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f8f9fa] rounded-xl sm:rounded-2xl p-2 shrink-0 border border-gray-100 flex items-center justify-center group"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain filter drop-shadow-xs mix-blend-multiply group-hover:scale-105 transition-transform"
                            />
                          </Link>

                          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-1.5 py-0.2 rounded">
                                {item.product.categoryName}
                              </span>
                              {item.product.brand && (
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  • {item.product.brand}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/products/${item.product.id}`}
                              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-rose-600 transition-colors block truncate"
                            >
                              {item.product.name}
                            </Link>

                            {item.selectedVolume && (
                              <span className="text-[11px] text-gray-400 font-medium block">
                                Size: {item.selectedVolume}
                              </span>
                            )}

                            {/* Price Row */}
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                                ₹{item.product.price}
                              </span>

                              {item.product.originalPrice > item.product.price && (
                                <span className="text-[11px] text-gray-400 line-through">
                                  ₹{item.product.originalPrice}
                                </span>
                              )}

                              {item.product.discountPercent > 0 && (
                                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded">
                                  {item.product.discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom (Mobile) / Right (Desktop): Quantity Controls & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Quantity Pill */}
                          <div className="flex items-center border border-gray-200 rounded-xl p-0.5 sm:p-1 bg-gray-50/80">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1, item.selectedVolume)}
                              className="p-1 sm:p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <span className="px-2.5 sm:px-3 text-xs font-bold text-gray-900 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1, item.selectedVolume)}
                              className="p-1 sm:p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Wishlist Button */}
                            <button
                              onClick={() => toggleWishlist(item.product.id)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                isWishlisted
                                  ? 'text-rose-500 bg-rose-50'
                                  : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100'
                              }`}
                              title={isWishlisted ? 'In Wishlist' : 'Move to Wishlist'}
                              aria-label="Wishlist"
                            >
                              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                            </button>

                            {/* Remove Item Button */}
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedVolume)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                              aria-label="Remove item"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden md:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* COUPON SECTION */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>Have a Promo / Coupon Code?</span>
                </h3>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5 truncate pr-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        Coupon <code className="bg-white px-2 py-0.5 rounded text-emerald-900 font-mono">{appliedCoupon.code}</code> applied!
                      </span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600 hover:text-emerald-900 cursor-pointer shrink-0"
                      aria-label="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try SAVE10 or WELCOME100"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-5 sm:px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] text-gray-400 font-medium">
                  <span className="text-gray-500 font-semibold">Popular:</span>
                  <button onClick={() => applyCoupon('SAVE10')} className="hover:text-rose-600 underline font-semibold cursor-pointer">
                    SAVE10 (10% OFF)
                  </button>
                  <span>•</span>
                  <button onClick={() => applyCoupon('WELCOME100')} className="hover:text-rose-600 underline font-semibold cursor-pointer">
                    WELCOME100 (₹100 OFF)
                  </button>
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-rose-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4 sm:space-y-5 sticky top-24">
                
                <h2 className="text-sm sm:text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-semibold text-gray-400">{cartTotalCount} items</span>
                </h2>

                <div className="space-y-2.5 sm:space-y-3 text-xs font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{cartSubtotal}</span>
                  </div>

                  {cartProductDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Product Discounts</span>
                      <span className="font-bold">-₹{cartProductDiscount}</span>
                    </div>
                  )}

                  {appliedCoupon && couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span className="font-bold">-₹{couponDiscountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Delivery</span>
                    <span className="font-bold text-emerald-600">
                      {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100 my-1 sm:my-2" />

                  <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 pt-0.5">
                    <span>Total Amount</span>
                    <span className="text-rose-600 font-black">₹{cartFinalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 sm:py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-1 text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Secure & Encrypted Checkout</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT ACTION BAR */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 shadow-2xl">
          <div className="min-w-0">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Total to Pay</span>
            <span className="text-base sm:text-lg font-black text-rose-600 truncate block">₹{cartFinalTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
