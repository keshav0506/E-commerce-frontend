import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';

interface DealSectionConfig {
  id: string;
  title: string;
  subtitle: string;
  containerBg: string;
  borderClass: string;
  catId?: string;
  filterFn: (products: Product[]) => Product[];
  tagFn?: (p: Product) => string;
}

export const SpecialDealsSection: React.FC = () => {
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useShop();

  // Curated pastel sections matching the Flipkart "Spotlight's on" aesthetic
  const dealSections: DealSectionConfig[] = [
    {
      id: 'spotlight-deals',
      title: "Spotlight's on",
      subtitle: "Handpicked deals with highest customer ratings",
      containerBg: "bg-[#dcf0e8]",
      borderClass: "border-emerald-100/60",
      catId: 'all',
      filterFn: (prods) => prods.slice(0, 4),
      tagFn: (p) => (p.rating >= 4.8 ? 'Top Rated' : 'Trending')
    },
    {
      id: 'trending-gadgets',
      title: "Trending Gadgets & Electronics",
      subtitle: "Min. 30% - 50% Off on Top Audio, Wearables & Tech",
      containerBg: "bg-[#e8f1fd]",
      borderClass: "border-blue-100/60",
      catId: 'electronics',
      filterFn: (prods) =>
        prods.filter(
          (p) => {
            const cat = (p.categoryName || p.categoryId || '').toLowerCase();
            return cat.includes('electronic') || cat.includes('accessori') || p.categoryId === '9' || p.categoryId === '6';
          }
        ).slice(0, 4),
      tagFn: () => 'Top Offers'
    },
    {
      id: 'festive-specials',
      title: "Festive & Celebration Specials",
      subtitle: "Traditional Hampers, Gourmet Bites & Celebration Apparel",
      containerBg: "bg-[#fdf0ec]",
      borderClass: "border-rose-100/60",
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
        ).slice(0, 4),
      tagFn: () => 'Special offer'
    },
    {
      id: 'best-sellers',
      title: "On Everybody's List (Top Sellers)",
      subtitle: "Most-loved customer favorites of the week",
      containerBg: "bg-[#fef6e6]",
      borderClass: "border-amber-100/60",
      catId: 'all',
      filterFn: (prods) =>
        prods
          .filter((p) => (p.rating || 4.5) >= 4.7)
          .slice(0, 4),
      tagFn: () => 'Most-loved'
    }
  ];

  return (
    <section aria-label="Curated Deals and Spotlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-5">
      {dealSections.map((section, sIndex) => {
        const sectionProducts = section.filterFn(products);
        if (sectionProducts.length === 0) return null;

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: sIndex * 0.05 }}
            className={`rounded-3xl ${section.containerBg} ${section.borderClass} border p-4 sm:p-5 shadow-xs`}
          >
            {/* SECTION HEADER (CLEAN PASTEL STYLE - NO LOUD GRADIENTS) */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {section.title}
                </h2>
                <p className="text-xs text-gray-600 font-medium hidden sm:block mt-0.5">
                  {section.subtitle}
                </p>
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
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0 group"
                aria-label={`Explore ${section.title}`}
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* 4 CLEAN COMPACT WHITE CARDS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {sectionProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                const tagText = section.tagFn ? section.tagFn(product) : 'Trending';

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-gray-100/50 relative"
                  >
                    {/* WISHLIST BUTTON (TOP RIGHT) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute right-3.5 top-3.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-gray-400 hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
                      aria-label="Wishlist product"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* PRODUCT IMAGE DISPLAY */}
                    <div className="w-full aspect-square bg-[#f8fafc] rounded-xl flex items-center justify-center p-2.5 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* BOTTOM TEXT (MATCHING SPOTLIGHT REFERENCE) */}
                    <div className="pt-2.5 px-0.5 space-y-1 text-left">
                      <span className="block text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
                        {tagText}
                      </span>

                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>

                      {/* PRICE & ADD TO CART */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-black text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </motion.div>
        );
      })}
    </section>
  );
};
