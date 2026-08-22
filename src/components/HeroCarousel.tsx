import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES, CATEGORIES, PRODUCTS } from '../data/mockData';
import { useShop } from '../context/ShopContext';
import type { HeroSlide } from '../types';

export const HeroCarousel: React.FC = () => {
  const { selectedCategoryId, addToCart } = useShop();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);

  // Construct active slide based on selected category or default hero carousel
  let activeSlide: HeroSlide;

  if (selectedCategoryId !== 'all' && activeCategory) {
    const catProduct = PRODUCTS.find((p) => p.categoryId === selectedCategoryId) || PRODUCTS[0];
    activeSlide = {
      id: `cat-${activeCategory.id}`,
      categoryId: activeCategory.id,
      badge: `${activeCategory.name.toUpperCase()} COLLECTION`,
      headline: activeCategory.heroTitle || activeCategory.name,
      subtitle: activeCategory.heroSubtitle || activeCategory.description,
      ctaText: 'Shop Collection',
      productImage: activeCategory.image,
      productName: catProduct.name,
      options: catProduct.volumes || ['Standard', 'Pack of 2'],
      bgGradient: activeCategory.heroBgGradient || 'from-rose-500/20 to-pink-500/10',
      textColor: 'text-white',
      ctaBg: 'bg-white hover:bg-gray-100',
      ctaTextColor: 'text-gray-900',
      badgeBg: 'bg-white/20 text-white backdrop-blur-md border border-white/30'
    };
  } else {
    activeSlide = HERO_SLIDES[currentSlideIndex % HERO_SLIDES.length];
  }

  // Reset selected volume option when slide changes
  useEffect(() => {
    if (activeSlide.options && activeSlide.options.length > 0) {
      setSelectedOption(activeSlide.options[0]);
    } else {
      setSelectedOption('');
    }
  }, [currentSlideIndex, selectedCategoryId]);

  // Autoplay carousel: 5.5 seconds per slide (paused on hover or when specific category selected)
  useEffect(() => {
    if (selectedCategoryId !== 'all' || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [selectedCategoryId, isHovered]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleCTA = () => {
    const matchingProd = PRODUCTS.find(
      (p) => p.name.toLowerCase().includes(activeSlide.productName.toLowerCase()) || p.categoryId === activeSlide.categoryId
    ) || PRODUCTS[0];
    addToCart(matchingProd, 1, selectedOption);
  };

  return (
    <section 
      aria-label="Promotional Hero Banner"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] flex items-center shadow-lg border border-gray-100/50 transition-all duration-500">
        
        {/* Animated Background Theme */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bgGradient}`}
          >
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black/10 blur-3xl pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Content Grid */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 text-left text-white">
            
            {/* Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${activeSlide.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
              >
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${activeSlide.badgeBg || 'bg-white/20 text-white backdrop-blur-md border border-white/30'}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {activeSlide.badge}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${activeSlide.id}`}
                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-xs"
              >
                {activeSlide.headline}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${activeSlide.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-base sm:text-lg text-white/90 max-w-xl font-normal leading-relaxed"
              >
                {activeSlide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* CTA Button */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${activeSlide.id}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="pt-2"
              >
                <button
                  onClick={handleCTA}
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                    activeSlide.ctaBg || 'bg-white text-gray-900 hover:bg-gray-100'
                  } ${activeSlide.ctaTextColor || 'text-gray-900'}`}
                >
                  <span>{activeSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Product Image & Option Selector */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Option Pills (e.g. 500ml, 300ml) */}
            {activeSlide.options && activeSlide.options.length > 0 && (
              <div className="absolute top-0 right-0 sm:right-4 z-20 hidden sm:flex items-center bg-white/20 backdrop-blur-md p-1 rounded-2xl border border-white/30 shadow-inner">
                {activeSlide.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedOption === opt
                        ? 'bg-white text-gray-900 shadow-md scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Animated Product Image Entrance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${activeSlide.id}`}
                initial={{ opacity: 0, scale: 0.82, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px] aspect-square flex items-center justify-center p-2"
              >
                <img
                  src={activeSlide.productImage}
                  alt={activeSlide.headline}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)] mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Previous / Next Controls */}
        {selectedCategoryId === 'all' && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-full shadow-lg transition-all duration-200 border border-white/30 cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-full shadow-lg transition-all duration-200 border border-white/30 cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Indicators */}
        {selectedCategoryId === 'all' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlideIndex % HERO_SLIDES.length === index
                    ? 'w-7 h-2.5 bg-white shadow-md'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
