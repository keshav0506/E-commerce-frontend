import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotalCount,
    cartFinalTotal
  } = useShop();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleGoToCartPage = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden text-left">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
                <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                  {cartTotalCount} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-rose-50/60 p-4 border-b border-rose-100">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-500" />
                  {cartSubtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-600 font-bold">You unlocked Free Delivery!</span>
                  ) : (
                    <span>Add ₹{freeShippingThreshold - cartSubtotal} more for Free Delivery</span>
                  )}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-rose-200/70 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Explore our products and add fresh organic juices, snacks, and tech essentials to your bag!
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVolume}`}
                    className="flex gap-4 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 items-center"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl p-2 shrink-0 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain filter drop-shadow-xs mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVolume && (
                        <span className="text-[11px] text-gray-400 font-medium block">
                          Size: {item.selectedVolume}
                        </span>
                      )}
                      <span className="text-xs font-bold text-rose-600">
                        ₹{item.product.price}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 border border-gray-200 bg-white rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1, item.selectedVolume)}
                        className="p-1 text-gray-500 hover:text-gray-800 rounded-md transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1, item.selectedVolume)}
                        className="p-1 text-gray-500 hover:text-gray-800 rounded-md transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVolume)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & View Cart Link */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {cartSubtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-rose-600">₹{cartFinalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>View Full Cart & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
