import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

interface FlipkartHeroBanner {
  id: string;
  brand: string;
  brandSub: string;
  title: string;
  highlight: string;
  subtitle: string;
  bankOffer?: string;
  image: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  categoryFilter?: string;
}

interface MiniBannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  discountText: string;
  image: string;
  bgGradient: string;
  categoryId?: string;
}

const HERO_BANNERS: FlipkartHeroBanner[] = [
  {
    id: 'banner-1',
    brand: 'boltt',
    brandSub: 'Shoply Unique',
    title: 'ACE 5G',
    highlight: 'From ₹12,999',
    subtitle: 'Sale on 1st Sep, 12 PM',
    bankOffer: '₹1,500 Off with HDFC / SBI Cards',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846812/ecommerce/products/mcbgbgucqnd293rjid65.jpg',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    textColor: 'text-white',
    accentColor: 'text-rose-400',
    categoryFilter: 'electronics'
  },
  {
    id: 'banner-2',
    brand: 'realme',
    brandSub: 'Exclusive Launch',
    title: 'P4s 5G | 8+128 GB',
    highlight: 'From ₹2,666/M*',
    subtitle: 'Excl. launch offer • 144 FPS Fast Smooth',
    bankOffer: 'Instant Bank Discounts Available',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg',
    bgGradient: 'from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]',
    textColor: 'text-gray-900',
    accentColor: 'text-blue-600',
    categoryFilter: 'electronics'
  },
  {
    id: 'banner-3',
    brand: 'boAt',
    brandSub: "INDIA'S #1 AUDIO",
    title: 'Rockerz 430 ANC',
    highlight: 'Up to 80% Off',
    subtitle: 'Effortless fit • 60H Playback • Deep Bass',
    bankOffer: 'Free Express Shipping',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg',
    bgGradient: 'from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]',
    textColor: 'text-gray-900',
    accentColor: 'text-orange-600',
    categoryFilter: 'accessories'
  },
  {
    id: 'banner-4',
    brand: 'NATIVE',
    brandSub: 'Fresh Harvest',
    title: 'Organic Beverages & Snacks',
    highlight: 'Flat 40% Off',
    subtitle: '100% Pure Cold-Pressed • No Preservatives',
    bankOffer: 'Buy 2 Get 1 Free Today',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg',
    bgGradient: 'from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]',
    textColor: 'text-gray-900',
    accentColor: 'text-pink-600',
    categoryFilter: 'beverages'
  }
];

const MINI_BANNERS: MiniBannerItem[] = [
  {
    id: 'mini-1',
    tag: 'Bolas',
    title: 'Premium Dry Fruits',
    subtitle: 'Buttery, crunchy snack with bigger savings',
    discountText: 'Up to 50% Off',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846783/ecommerce/products/sonwmknronpjyv4qoxdb.jpg',
    bgGradient: 'from-amber-900/90 via-amber-950/80 to-black/90',
    categoryId: 'snacks'
  },
  {
    id: 'mini-2',
    tag: 'Active',
    title: 'Pet Care & Food',
    subtitle: 'Twice the happiness for your best companions',
    discountText: 'Up to 15% Off',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846812/ecommerce/products/mcbgbgucqnd293rjid65.jpg',
    bgGradient: 'from-zinc-900/90 via-zinc-950/85 to-black/95',
    categoryId: 'essentials'
  },
  {
    id: 'mini-3',
    tag: 'Little Angel',
    title: 'Baby Essentials & Diapers',
    subtitle: "For every mom's love & every baby's smile",
    discountText: 'Up to 60% Off',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg',
    bgGradient: 'from-stone-900/90 via-stone-950/85 to-black/95',
    categoryId: 'care'
  },
  {
    id: 'mini-4',
    tag: 'PediaSure',
    title: 'Health & Nutrition',
    subtitle: 'Specialized nutrition to support bone growth',
    discountText: 'Up to 20% Off',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg',
    bgGradient: 'from-indigo-950/90 via-slate-950/85 to-black/95',
    categoryId: 'supplements'
  },
  {
    id: 'mini-5',
    tag: 'MeeMee',
    title: 'Baby Comfort Care',
    subtitle: 'Gentle & Dermatologist Tested',
    discountText: 'Up to 50% Off',
    image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg',
    bgGradient: 'from-rose-950/90 via-pink-950/85 to-black/95',
    categoryId: 'babycare'
  }
];

export const HeroCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategoryId } = useShop();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const miniScrollRef = useRef<HTMLDivElement>(null);

  // Auto slide top carousel every 4.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const handleMiniScroll = (direction: 'left' | 'right') => {
    if (miniScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      miniScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleBannerClick = (cat?: string) => {
    if (cat) {
      setSelectedCategoryId(cat);
    }
    navigate('/products');
  };

  // Get active slide and next slide for 2-card desktop view
  const slide1 = HERO_BANNERS[currentSlideIndex];
  const slide2 = HERO_BANNERS[(currentSlideIndex + 1) % HERO_BANNERS.length];

  return (
    <section
      aria-label="Promotional Banners"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1 space-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================================================= */}
      {/* 1. TOP FLIPKART-STYLE HERO BANNER CAROUSEL (COMPACT HEIGHT: ~210px)       */}
      {/* ========================================================================= */}
      <div className="relative group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          
          {/* Card 1 */}
          <motion.div
            key={slide1.id}
            initial={{ opacity: 0.7, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleBannerClick(slide1.categoryFilter)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide1.bgGradient} p-5 sm:p-6 h-[190px] sm:h-[210px] flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-200/40`}
          >
            {/* Top Brand Tag */}
            <div className="flex items-center gap-2 z-10">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                {slide1.brand}
              </span>
              <span className={`text-[11px] font-bold opacity-80 ${slide1.textColor}`}>
                {slide1.brandSub}
              </span>
            </div>

            {/* Middle Title & Highlight */}
            <div className="z-10 max-w-[65%] sm:max-w-[60%] space-y-1">
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${slide1.textColor}`}>
                {slide1.title}
              </h3>
              <div className={`text-base sm:text-lg font-extrabold ${slide1.accentColor}`}>
                {slide1.highlight}
              </div>
              <p className={`text-[11px] font-medium opacity-75 line-clamp-1 ${slide1.textColor}`}>
                {slide1.subtitle}
              </p>
            </div>

            {/* Bottom Bank Offer & AD Tag */}
            <div className="flex items-center justify-between z-10 pt-1">
              {slide1.bankOffer && (
                <span className="text-[10px] font-bold bg-black/10 text-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 truncate max-w-[80%]">
                  {slide1.bankOffer}
                </span>
              )}
              <span className="text-[9px] font-extrabold uppercase bg-black/20 text-white/70 px-1.5 py-0.5 rounded ml-auto">
                AD
              </span>
            </div>

            {/* Product Cutout Graphic on Right */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-32 sm:h-44 pointer-events-none flex items-center justify-center">
              <img
                src={slide1.image}
                alt={slide1.title}
                className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Card 2 (Desktop View) */}
          <motion.div
            key={slide2.id}
            initial={{ opacity: 0.7, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleBannerClick(slide2.categoryFilter)}
            className={`hidden md:flex relative overflow-hidden rounded-2xl bg-gradient-to-r ${slide2.bgGradient} p-5 sm:p-6 h-[190px] sm:h-[210px] flex-col justify-between cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-200/40`}
          >
            {/* Top Brand Tag */}
            <div className="flex items-center gap-2 z-10">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 bg-white/90 px-2 py-0.5 rounded shadow-xs">
                {slide2.brand}
              </span>
              <span className={`text-[11px] font-bold opacity-80 ${slide2.textColor}`}>
                {slide2.brandSub}
              </span>
            </div>

            {/* Middle Title & Highlight */}
            <div className="z-10 max-w-[60%] space-y-1">
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${slide2.textColor}`}>
                {slide2.title}
              </h3>
              <div className={`text-base sm:text-lg font-extrabold ${slide2.accentColor}`}>
                {slide2.highlight}
              </div>
              <p className={`text-[11px] font-medium opacity-75 line-clamp-1 ${slide2.textColor}`}>
                {slide2.subtitle}
              </p>
            </div>

            {/* Bottom Bank Offer & AD Tag */}
            <div className="flex items-center justify-between z-10 pt-1">
              {slide2.bankOffer && (
                <span className="text-[10px] font-bold bg-black/10 text-gray-800 backdrop-blur-xs px-2 py-0.5 rounded border border-gray-300/40 truncate max-w-[80%]">
                  {slide2.bankOffer}
                </span>
              )}
              <span className="text-[9px] font-extrabold uppercase bg-black/10 text-gray-600 px-1.5 py-0.5 rounded ml-auto">
                AD
              </span>
            </div>

            {/* Product Cutout Graphic on Right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 sm:w-44 h-40 sm:h-44 pointer-events-none flex items-center justify-center">
              <img
                src={slide2.image}
                alt={slide2.title}
                className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>

        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-gray-800 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-gray-800 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots Pagination */}
        <div className="flex justify-center gap-1.5 mt-2">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentSlideIndex ? 'w-5 bg-rose-500' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM MINI BANNERS STRIP (COMPACT CATEGORY DEALS: ~110px)             */}
      {/* ========================================================================= */}
      <div className="relative group/mini pt-0.5">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleMiniScroll('left')}
          aria-label="Previous Mini Banners"
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-gray-800 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover/mini:opacity-100 transition-all hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scroll Container */}
        <div
          ref={miniScrollRef}
          className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none snap-x"
        >
          {MINI_BANNERS.map((mini) => (
            <motion.div
              key={mini.id}
              whileHover={{ y: -2 }}
              onClick={() => handleBannerClick(mini.categoryId)}
              className="relative shrink-0 w-[240px] sm:w-[270px] lg:w-[285px] h-[105px] sm:h-[115px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all border border-gray-200/60 bg-gray-900 group/card snap-start"
            >
              {/* Background Product Image */}
              <img
                src={mini.image}
                alt={mini.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover/card:scale-105 transition-transform duration-500"
              />

              {/* Gradient Dark Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${mini.bgGradient}`} />

              {/* Content Container */}
              <div className="relative z-10 h-full p-3 flex flex-col justify-between text-white">
                {/* Top Row: Tag & AD */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-white border border-white/20">
                    {mini.tag}
                  </span>
                  <span className="text-[8px] font-bold uppercase bg-black/40 text-white/70 px-1.5 py-0.5 rounded">
                    AD
                  </span>
                </div>

                {/* Middle: Subtitle */}
                <p className="text-[10px] font-medium text-white/90 line-clamp-1">
                  {mini.subtitle}
                </p>

                {/* Bottom: Discount Badge */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-xs font-black tracking-tight text-amber-300">
                    {mini.discountText}
                  </span>
                  <span className="text-[10px] font-bold text-white/80 flex items-center gap-0.5 group-hover/card:translate-x-0.5 transition-transform">
                    Shop &gt;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleMiniScroll('right')}
          aria-label="Next Mini Banners"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-gray-800 shadow-md border border-gray-200 flex items-center justify-center opacity-0 group-hover/mini:opacity-100 transition-all hover:scale-110 z-20 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
