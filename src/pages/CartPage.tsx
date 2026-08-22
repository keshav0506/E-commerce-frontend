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
    toggleWishlist
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
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">Cart</span>
        </nav>

        {/* Page Header */}
        <div className="pb-6 border-b border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review your items before checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 self-start sm:self-auto">
              {cartTotalCount} {cartTotalCount === 1 ? 'Item' : 'Items'} in Bag
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          /* POLISHED EMPTY CART STATE */
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs space-y-4">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Your cart is empty</h2>
              <p className="text-xs text-gray-500 mt-1">
                Looks like you haven't added anything yet. Explore our categories to get started!
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* TWO-COLUMN CART LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CART ITEMS & COUPONS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Delivery Progress Bar */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-rose-500" />
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-extrabold">🎉 You unlocked Free Delivery!</span>
                    ) : (
                      <span>Add ₹{freeShippingThreshold - cartSubtotal} more for Free Delivery</span>
                    )}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedVolume}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="w-20 h-20 bg-[#f8f9fa] rounded-2xl p-2 shrink-0 border border-gray-100 flex items-center justify-center group"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain filter drop-shadow-xs mix-blend-multiply group-hover:scale-105 transition-transform"
                          />
                        </Link>

                        <div className="space-y-1 min-w-0">
                          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                            {item.product.categoryName}
                          </span>
                          <Link
                            to={`/products/${item.product.id}`}
                            className="text-sm font-bold text-gray-900 hover:text-rose-600 transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>

                          {item.selectedVolume && (
                            <span className="text-xs text-gray-400 font-medium block">
                              Size: {item.selectedVolume}
                            </span>
                          )}

                          {/* Pricing */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-sm font-extrabold text-gray-900">
                              ₹{item.product.price}
                            </span>

                            {item.product.originalPrice > item.product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{item.product.originalPrice}
                              </span>
                            )}

                            {item.product.discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                                {item.product.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1, item.selectedVolume)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1, item.selectedVolume)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            toggleWishlist(item.product.id);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Move to Wishlist"
                          aria-label="Move to Wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVolume)}
                          className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* COUPON SECTION */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>Have a Coupon Code?</span>
                </h3>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Coupon <code className="bg-white px-2 py-0.5 rounded text-emerald-900 font-mono">{appliedCoupon.code}</code> applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600 hover:text-emerald-900 cursor-pointer"
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
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                <div className="flex gap-2 pt-1 text-[11px] text-gray-400 font-medium">
                  <span>Popular coupons:</span>
                  <button onClick={() => applyCoupon('SAVE10')} className="hover:text-rose-600 underline">SAVE10 (10% OFF)</button>
                  <span>•</span>
                  <button onClick={() => applyCoupon('WELCOME100')} className="hover:text-rose-600 underline">WELCOME100 (₹100 OFF)</button>
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div className="pt-2">
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
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5 sticky top-24">
                
                <h2 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartTotalCount} items)</span>
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
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span className="font-bold">-₹{couponDiscountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Delivery</span>
                    <span className="font-bold text-emerald-600">
                      {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100 my-2" />

                  <div className="flex justify-between text-base font-black text-gray-900 pt-1">
                    <span>Total Amount</span>
                    <span className="text-rose-600">₹{cartFinalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Encrypted & Safe Checkout</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT ACTION BAR */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex items-center justify-between gap-4 shadow-2xl">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
            <span className="text-lg font-black text-rose-600">₹{cartFinalTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
