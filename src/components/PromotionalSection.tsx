import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Tag, Gift } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PROMOTIONS, PRODUCTS } from '../data/mockData';

export const PromotionalSection: React.FC = () => {
  const { addToCart, setSelectedCategoryId } = useShop();

  const handleBannerClick = (promoId: string) => {
    if (promoId === 'promo-1') {
      setSelectedCategoryId('footwear');
    } else if (promoId === 'promo-2') {
      setSelectedCategoryId('electronics');
    } else {
      addToCart(PRODUCTS[0]);
    }
  };

  const getIcon = (badge: string) => {
    if (badge.includes('SALE')) return <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />;
    if (badge.includes('LAUNCH')) return <Tag className="w-3.5 h-3.5" />;
    return <Gift className="w-3.5 h-3.5 text-pink-200" />;
  };

  return (
    <section aria-label="Promotions and Special Offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOTIONS.map((promo, idx) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-3xl ${promo.bgClass} p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between min-h-[240px]`}
          >
            {/* Top Text Content */}
            <div className="relative z-10 max-w-[220px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md mb-3 border border-white/30">
                {getIcon(promo.badge)}
                {promo.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-1">
                {promo.title}
              </h3>
              {promo.subtitle && (
                <p className="text-xs text-white/90 mb-5 font-normal leading-relaxed">
                  {promo.subtitle}
                </p>
              )}
              <button
                onClick={() => handleBannerClick(promo.id)}
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer group"
              >
                <span>{promo.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Product / Visual Artwork Overlay */}
            <div className="absolute -right-4 -bottom-4 w-36 sm:w-44 h-36 sm:h-44 pointer-events-none opacity-90">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
