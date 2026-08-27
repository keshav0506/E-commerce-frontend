import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

interface SpotlightCard {
  id: string;
  tag: string;
  title: string;
  image: string;
  categoryId?: string;
}

interface SpotlightSet {
  id: string;
  heading: string;
  cards: SpotlightCard[];
}

const SPOTLIGHT_SETS: SpotlightSet[] = [
  {
    id: 'set-1',
    heading: "Spotlight's on",
    cards: [
      {
        id: 'spot-1',
        tag: 'Trending',
        title: 'Top Rated',
        image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846783/ecommerce/products/sonwmknronpjyv4qoxdb.jpg',
        categoryId: 'snacks'
      },
      {
        id: 'spot-2',
        tag: 'Top Offers',
        title: 'Min. 70% Off',
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
        categoryId: 'clothing'
      },
      {
        id: 'spot-3',
        tag: 'Grab Or Gone',
        title: 'Top Rated',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        categoryId: 'accessories'
      },
      {
        id: 'spot-4',
        tag: 'Most-loved',
        title: 'Special offer',
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=80',
        categoryId: 'footwear'
      }
    ]
  },
  {
    id: 'set-2',
    heading: "Trending Deals",
    cards: [
      {
        id: 'spot-5',
        tag: 'Best Sellers',
        title: 'From ₹1,999',
        image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846812/ecommerce/products/mcbgbgucqnd293rjid65.jpg',
        categoryId: 'electronics'
      },
      {
        id: 'spot-6',
        tag: 'Studio Sound',
        title: 'Flat 45% Off',
        image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg',
        categoryId: 'accessories'
      },
      {
        id: 'spot-7',
        tag: 'Cold Pressed',
        title: 'Pack of 3 at ₹499',
        image: 'https://res.cloudinary.com/oqmadwpj/image/upload/v1787846790/ecommerce/products/foq3pj2h2qmtckbuwu0o.jpg',
        categoryId: 'beverages'
      },
      {
        id: 'spot-8',
        tag: 'Daily Comfort',
        title: 'Up to 50% Off',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        categoryId: 'footwear'
      }
    ]
  }
];

export const HeroCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategoryId } = useShop();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const currentSet = SPOTLIGHT_SETS[currentSetIndex];

  const handleNext = () => {
    setCurrentSetIndex((prev) => (prev + 1) % SPOTLIGHT_SETS.length);
  };

  const handlePrev = () => {
    setCurrentSetIndex((prev) => (prev - 1 + SPOTLIGHT_SETS.length) % SPOTLIGHT_SETS.length);
  };

  const handleCardClick = (categoryId?: string) => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
    navigate('/products');
  };

  return (
    <section aria-label="Spotlight Deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* SOFT PASTEL MINT/GREEN CONTAINER MATCHING UPLOADED IMAGE */}
      <div className="relative rounded-3xl bg-[#dcf0e8] p-4 sm:p-5 border border-emerald-100/60 shadow-xs">
        
        {/* HEADER TITLE & CONTROLS */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            {currentSet.heading}
          </h2>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous Set"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Set"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 COMPACT CLEAN WHITE CARDS ROW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSet.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {currentSet.cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.categoryId)}
                className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group border border-gray-100/40"
              >
                {/* Product Image Box */}
                <div className="w-full aspect-square bg-[#f8fafc] rounded-xl flex items-center justify-center p-2.5 overflow-hidden relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Bottom Clean Typography (No Gradients) */}
                <div className="pt-2.5 px-0.5 space-y-0.5 text-left">
                  <span className="block text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
                    {card.tag}
                  </span>
                  <span className="block text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                    {card.title}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
