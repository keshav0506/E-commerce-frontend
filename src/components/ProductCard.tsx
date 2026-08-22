import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Star, Check } from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, cart } = useShop();
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);
  const inCartItem = cart.find((item) => item.product.id === product.id);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl border border-gray-100/90 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Badge & Wishlist Heart */}
      <div className="flex items-center justify-between z-10">
        <div>
          {product.badge && (
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 rounded-full border border-rose-100/80">
              {product.badge}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-gray-50/80 text-gray-400 hover:text-rose-500 hover:bg-rose-50 shadow-2xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Seamless Image Area with Quick Add (+) Button */}
      <div className="relative my-2 aspect-square flex items-center justify-center p-3 rounded-xl bg-slate-50/40 group-hover:bg-rose-50/30 transition-colors duration-300 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-md mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className={`absolute bottom-1.5 right-1.5 p-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 z-10 ${
            inCartItem
              ? 'bg-rose-500 text-white'
              : 'bg-white hover:bg-rose-50 text-gray-800 hover:text-rose-600 border border-gray-100'
          }`}
          title="Quick Add to Cart"
        >
          {inCartItem ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
        </button>
      </div>

      {/* Product Details */}
      <div className="pt-2 flex flex-col space-y-1.5 text-left">
        {/* Rating */}
        <div className="flex items-center space-x-1 text-xs text-amber-500 font-medium">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal">({product.reviewCount})</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price Row: Current | Original | Discount Badge */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-base font-extrabold text-gray-900">
            ₹{product.price}
          </span>

          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="text-xs font-bold text-rose-500 ml-auto">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
