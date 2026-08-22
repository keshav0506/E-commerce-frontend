import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CategoryNav: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId } = useShop();
  const navigate = useNavigate();

  return (
    <section aria-label="Shop by Category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Shop by Category
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer group"
        >
          <span>View all categories</span>
          <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex sm:grid sm:grid-cols-5 md:grid-cols-9 gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {categories.map((cat, index) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="flex flex-col items-center group cursor-pointer text-center outline-none shrink-0 w-24 sm:w-auto"
            >
              <div
                className={`w-full aspect-square rounded-2xl flex items-center justify-center p-3 transition-all duration-300 relative overflow-hidden ${
                  cat.bgColor
                } ${
                  isSelected
                    ? 'ring-2 ring-rose-500 shadow-md scale-105'
                    : 'hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <span
                className={`mt-2 text-xs font-semibold transition-colors ${
                  isSelected ? 'text-rose-600 font-bold' : 'text-gray-800 group-hover:text-rose-600'
                }`}
              >
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
