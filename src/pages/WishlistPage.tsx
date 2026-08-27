import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { products, wishlist, addToCart, clearWishlist, showToast } = useShop();

  // Resolve full Product objects from centralized products list using wishlist IDs
  const wishlistedProducts = products.filter((p) => wishlist.some((id) => String(id) === String(p.id)));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((product) => {
      addToCart(product, 1);
    });
    showToast(`Added ${wishlistedProducts.length} wishlist items to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-500 mb-4">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="pb-6 border-b border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>My Wishlist</span>
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Save products you love and come back to them anytime.
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'saved product' : 'saved products'}
              </span>

              <button
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-rose-400" />
                <span>Add All to Cart</span>
              </button>

              <button
                onClick={clearWishlist}
                className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlistedProducts.length === 0 ? (
          /* POLISHED EMPTY WISHLIST STATE */
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs space-y-4">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Your wishlist is empty</h2>
              <p className="text-xs text-gray-500 mt-1">
                Save products you love and they'll appear here for quick access!
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
          /* RESPONSIVE WISHLIST PRODUCT GRID */
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};
