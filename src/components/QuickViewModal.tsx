import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<string>('');

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const activeVolume = selectedVolume || quickViewProduct.volumes?.[0] || 'Standard';

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, activeVolume);
    setQuickViewProduct(null);
    setQuantity(1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 sm:p-8"
        >
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-50/50 rounded-2xl p-6 flex items-center justify-center aspect-square">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain filter drop-shadow-lg mix-blend-multiply max-h-64"
              />
            </div>

            <div className="flex flex-col text-left space-y-4">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  {quickViewProduct.categoryName}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{quickViewProduct.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({quickViewProduct.reviewCount} customer reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{quickViewProduct.price}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{quickViewProduct.originalPrice}
                  </span>
                )}
                {quickViewProduct.discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    {quickViewProduct.discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {quickViewProduct.volumes && quickViewProduct.volumes.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-700 block mb-2">Select Size / Volume</span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.volumes.map((vol) => (
                      <button
                        key={vol}
                        onClick={() => setSelectedVolume(vol)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          activeVolume === vol
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-rose-200'
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart • ₹{quickViewProduct.price * quantity}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
