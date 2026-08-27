import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FlashSaleBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section aria-label="Mega Flash Sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
      <motion.div
        whileHover={{ scale: 1.005 }}
        onClick={() => navigate('/products')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] border border-blue-200/80 shadow-md cursor-pointer p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 min-h-[115px] sm:min-h-[135px]"
      >
        {/* Background Clouds / Sky Graphic Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100/60 via-transparent to-transparent pointer-events-none" />

        {/* LEFT: 3D "FLASH SALE" BADGE */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* 3D Embossed FLASH SALE Title */}
            <div className="text-center sm:text-left">
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
        </div>

        {/* CENTER: HEADLINE & TIME SLOTS */}
        <div className="z-10 text-center md:text-left space-y-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">
            Flat <span className="text-[#1d4ed8]">15% - 50% Off</span> on All Category Bookings & Deals
          </h2>

          {/* Time Slot Pill */}
          <div className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm transition-colors">
            <Clock className="w-3.5 h-3.5" />
            <span>2-3 PM</span>
            <span className="opacity-50">|</span>
            <span>8-9 PM</span>
            <span className="opacity-50">|</span>
            <span>10 PM-12 AM</span>
          </div>
        </div>

        {/* RIGHT: AIRCRAFT / JET GRAPHIC ILLUSTRATION */}
        <div className="hidden lg:flex items-center justify-end z-10 shrink-0">
          <div className="relative w-48 h-24 flex items-center justify-center">
            {/* Airplane / Rocket Icon Illustration */}
            <svg
              viewBox="0 0 200 100"
              className="w-full h-full filter drop-shadow-xl transform -rotate-6 group-hover:translate-x-2 transition-transform duration-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Jet body */}
              <path
                d="M10 50 C 40 45, 120 40, 180 45 C 195 47, 195 53, 180 55 C 120 60, 40 55, 10 50 Z"
                fill="#ffffff"
                stroke="#1e3a8a"
                strokeWidth="2"
              />
              {/* Cockpit */}
              <path d="M160 46 C 170 47, 175 48, 175 51 C 170 52, 160 51, 160 46 Z" fill="#38bdf8" />
              {/* Wing */}
              <path d="M80 50 L 50 15 L 75 15 L 120 50 Z" fill="#2563eb" />
              {/* Tail wing */}
              <path d="M20 50 L 5 25 L 20 25 L 35 50 Z" fill="#1d4ed8" />
              {/* Jet engine glow */}
              <circle cx="85" cy="55" r="5" fill="#f59e0b" />
              <line x1="80" y1="55" x2="30" y2="55" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 2" />
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
