import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye, Heart, Star, Sparkles, Flame, Tag, Zap, Gift } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';

interface DealSectionConfig {
  id: string;
  title: string;
  subtitle: string;
  headerBg: string;
  textColor: string;
  icon: React.ReactNode;
  filterFn: (products: Product[]) => Product[];
  catId?: string;
}

export const SpecialDealsSection: React.FC = () => {
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, setQuickViewProduct } = useShop();

  // Define 5 distinct card-structured deal categories
  const dealSections: DealSectionConfig[] = [
    {
      id: 'trending-gadgets',
      title: 'Trending Gadgets & Electronics',
      subtitle: 'Min. 40% - 50% Off on Top Tech & Accessories',
      headerBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500',
      textColor: 'text-white',
      icon: <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />,
      catId: 'electronics',
      filterFn: (prods) =>
        prods.filter(
          (p) => {
            const cat = (p.categoryName || p.categoryId || '').toLowerCase();
            return cat.includes('electronic') || cat.includes('accessori') || p.categoryId === '9' || p.categoryId === '6';
          }
        ).slice(0, 4)
    },
    {
      id: 'festive-specials',
      title: 'August Festive Specials (Rakhi & Independence Edition)',
      subtitle: 'Festive Hampers, Sweets, Traditional Apparel & Celebration Drinks',
      headerBg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500',
      textColor: 'text-white',
      icon: <Gift className="w-5 h-5 text-amber-200 fill-amber-200" />,
      catId: 'snacks',
      filterFn: (prods) =>
        prods.filter(
          (p) =>
            p.badge?.toLowerCase().includes('festive') ||
            p.badge?.toLowerCase().includes('rakhi') ||
            p.name.toLowerCase().includes('festive') ||
            p.name.toLowerCase().includes('sweet') ||
            p.name.toLowerCase().includes('kurta') ||
            p.name.toLowerCase().includes('berry') ||
            p.name.toLowerCase().includes('juice') ||
            p.name.toLowerCase().includes('hamper')
        ).slice(0, 4)
    },
    {
      id: 'best-sellers',
      title: "On Everybody's List (Most Sellers)",
      subtitle: 'Top Rated Essentials Loved by Thousands of Customers',
      headerBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
      textColor: 'text-white',
      icon: <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />,
      catId: 'all',
      filterFn: (prods) =>
        prods
          .filter((p) => (p.rating || 4.5) >= 4.7)
          .slice(0, 4)
    },
    {
      id: 'season-specials',
      title: 'Season Specials (Monsoon Comforts)',
      subtitle: 'Warm Brews, Roasted Nuts, Eco Home Care & Activewear',
      headerBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600',
      textColor: 'text-white',
      icon: <Sparkles className="w-5 h-5 text-teal-200" />,
      catId: 'beverages',
      filterFn: (prods) =>
        prods.filter(
          (p) =>
            p.name.toLowerCase().includes('coffee') ||
            p.name.toLowerCase().includes('almond') ||
            p.name.toLowerCase().includes('athletic') ||
            p.name.toLowerCase().includes('spray') ||
            p.name.toLowerCase().includes('tea') ||
            p.name.toLowerCase().includes('hoodie')
        ).slice(0, 4)
    },
    {
      id: 'top-discounts',
      title: 'Top Discounts & Crazy Offers',
      subtitle: 'Massive Savings: Min. 40% to 70% Off On Selected Picks',
      headerBg: 'bg-gradient-to-r from-purple-700 via-indigo-700 to-rose-600',
      textColor: 'text-white',
      icon: <Tag className="w-5 h-5 text-rose-300 fill-rose-300" />,
      catId: 'all',
      filterFn: (prods) =>
        prods
          .filter((p) => (p.discountPercent || 0) >= 20)
          .slice(0, 4)
    }
  ];

  return (
    <section aria-label="Special Deals and Collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {dealSections.map((section, sIndex) => {
        const sectionProducts = section.filterFn(products);

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: sIndex * 0.08 }}
            className="rounded-3xl shadow-sm border border-gray-100 overflow-hidden bg-white"
          >
            {/* CONTAINER TOP BANNER HEADER */}
            <div className={`${section.headerBg} p-4 sm:p-5 flex items-center justify-between shadow-xs`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-medium hidden sm:block mt-0.5">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* VIEW ALL BUTTON */}
              <button
                onClick={() => {
                  if (section.catId && section.catId !== 'all') {
                    navigate(`/products?category=${section.catId}`);
                  } else {
                    navigate('/products');
                  }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 group"
                aria-label={`Explore ${section.title}`}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* INNER CARD GRID CONTAINER */}
            <div className="p-4 sm:p-5 bg-gray-50/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {sectionProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* TOP ACTIONS: WISHLIST & BADGE */}
                      <div className="flex items-start justify-between gap-1 mb-2 z-10">
                        {product.badge ? (
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Special Offer
                          </span>
                        )}

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1.5 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                          aria-label="Wishlist product"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* SEAMLESS BLENDED PRODUCT IMAGE */}
                      <div
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="bg-slate-50/50 rounded-2xl p-3 flex items-center justify-center aspect-square cursor-pointer group-hover:bg-rose-50/30 transition-colors relative overflow-hidden"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* QUICK VIEW OVERLAY */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="p-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* PRODUCT DETAILS */}
                      <div className="mt-3 space-y-1 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {product.categoryName}
                        </span>

                        <h3
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="text-xs sm:text-sm font-extrabold text-gray-900 truncate hover:text-rose-600 cursor-pointer transition-colors"
                        >
                          {product.name}
                        </h3>

                        {/* RATING */}
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </div>
                          <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                          <span className="text-[11px] text-gray-400 font-medium">({product.reviewCount})</span>
                        </div>

                        {/* PRICE & ADD TO CART */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-sm sm:text-base font-black text-gray-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-gray-400 line-through ml-1.5 font-medium">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product, 1)}
                            className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};
