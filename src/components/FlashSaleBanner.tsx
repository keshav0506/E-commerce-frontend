import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';

export const FlashSaleBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section aria-label="Mega Flash Sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
      <motion.div
        whileHover={{ scale: 1.003 }}
        onClick={() => navigate('/products')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] border border-blue-200/80 shadow-md cursor-pointer p-4 sm:p-5 lg:p-6 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[115px] sm:min-h-[130px]"
      >
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent pointer-events-none" />

        {/* LEFT: 3D "FLASH SALE" EMBLEM */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="text-center md:text-left">
            <div className="text-2xl sm:text-4xl font-black italic tracking-tighter text-[#1e40af] drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)] uppercase flex items-center gap-1.5 leading-none">
              <span>FLASH</span>
              <span className="text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 fill-amber-400 text-amber-400 inline" />
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-black italic tracking-tighter text-[#1d4ed8] drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)] uppercase leading-none mt-0.5">
              <span>SALE</span>
            </div>
          </div>
        </div>

        {/* CENTER: HEADLINE & TIME SLOTS */}
        <div className="z-10 text-center md:text-left space-y-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">
            Flat <span className="text-[#1d4ed8]">20% - 50% Off</span> on Electronics, Apparel & Essentials
          </h2>

          {/* Time Slot Pill */}
          <div className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-xs transition-colors">
            <Clock className="w-3.5 h-3.5" />
            <span>2-3 PM</span>
            <span className="opacity-50">|</span>
            <span>8-9 PM</span>
            <span className="opacity-50">|</span>
            <span>10 PM-12 AM</span>
          </div>
        </div>

        {/* RIGHT: E-COMMERCE PRODUCTS CUTOUT */}
        <div className="hidden lg:flex items-center justify-end z-10 shrink-0 gap-2">
          <div className="relative w-28 h-24 flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/oqmadwpj/image/upload/v1787846812/ecommerce/products/mcbgbgucqnd293rjid65.jpg"
              alt="Smartwatch Deal"
              className="w-20 h-20 object-contain filter drop-shadow-xl transform -rotate-6 hover:scale-105 transition-transform"
            />
          </div>
          <div className="relative w-28 h-24 flex items-center justify-center -ml-8">
            <img
              src="https://res.cloudinary.com/oqmadwpj/image/upload/v1787846770/ecommerce/products/yn4qovboszpxtefr7yjo.jpg"
              alt="Headphones Deal"
              className="w-22 h-22 object-contain filter drop-shadow-xl transform rotate-6 hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
