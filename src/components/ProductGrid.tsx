import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';

export const ProductGrid: React.FC = () => {
  const { filteredProducts, selectedCategoryId, categories, setSelectedCategoryId, searchQuery } = useShop();
  const navigate = useNavigate();

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <section id="featured-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategoryId === 'all'
                ? 'Featured Products'
                : `${currentCategory?.name || 'Category'} Products`}
            </span>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredProducts.length} items
            </span>
          </h2>
          {currentCategory && selectedCategoryId !== 'all' && (
            <p className="text-sm text-gray-500 mt-1">
              {currentCategory.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedCategoryId !== 'all' && (
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}

          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer group"
          >
            <span>View all products</span>
            <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="bg-gray-50/80 rounded-3xl p-12 text-center my-6 max-w-lg mx-auto border border-gray-100">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500 mb-6">
            We couldn't find any products matching your current category filter or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryId('all');
            }}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-full font-semibold text-sm hover:bg-rose-600 shadow-md transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
