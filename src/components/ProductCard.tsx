import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Star, Check, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846340/ecommerce/products/re1p3tqmpjl4gdqngjf1.jpg';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, cart } = useShop();
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);

  const isWishlisted = wishlist.some((id) => String(id) === String(product.id));
  const inCartItem = cart.find((item) => item.product.id === product.id);

  const isOutOfStock = !product.inStock || product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (product.lowStockThreshold ?? 5);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const supplierName = product.supplier?.businessName || `${product.categoryName || 'Brand'} Supplier`;
  const supplierId = product.supplier?.id || product.categoryId || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className={`group relative bg-[#f3f4f6] hover:bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-xl border border-gray-200/80 hover:border-rose-200/90 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      {/* Top Badge & Wishlist Heart */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.brand && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-700 bg-white border border-gray-200/80 rounded-md shadow-2xs">
              {product.brand}
            </span>
          )}

          {isOutOfStock ? (
            <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 rounded-md">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 rounded-md">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Only {product.stock} left
            </span>
          ) : product.badge ? (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 rounded-md border border-rose-100/80">
              {product.badge}
            </span>
          ) : null}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-xs border border-rose-100'
              : 'bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50 shadow-2xs border border-gray-200/70'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Seamless Image Area with Quick Add (+) Button */}
      <div className="relative my-2 aspect-square flex items-center justify-center p-3 rounded-xl bg-white shadow-2xs border border-gray-200/60 group-hover:border-rose-100 group-hover:shadow-xs transition-all duration-300 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
        />

        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className={`absolute bottom-1.5 right-1.5 p-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 z-10 ${
              inCartItem
                ? 'bg-rose-500 text-white'
                : 'bg-white hover:bg-rose-500 text-gray-800 hover:text-white border border-gray-200/80 shadow-xs'
            }`}
            title="Quick Add to Cart"
          >
            {inCartItem ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-2 flex flex-col space-y-1.5 text-left">
        {/* Rating & Category */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-gray-400 font-normal">({product.reviewCount})</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[45%]">
            {product.categoryName}
          </span>
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

        {/* PROMINENT SUPPLIER ATTRIBUTION & DIRECT STOREFRONT HATEOAS LINK */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/supplier-store/${supplierId}`);
          }}
          className="pt-2 mt-1 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-gray-500 hover:text-rose-600 transition-all group/supplier cursor-pointer"
          title={`Click to view all products from ${supplierName}`}
        >
          <div className="flex items-center gap-1.5 truncate min-w-0">
            <Building2 className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover/supplier:scale-110 transition-transform" />
            <span className="text-gray-400 text-[10px]">Sold by:</span>
            <span className="font-bold text-gray-800 group-hover/supplier:text-rose-600 truncate text-[11px]">
              {supplierName}
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0 ml-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            Verified
          </span>
        </div>
      </div>
    </motion.div>
  );
};
