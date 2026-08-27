import React from 'react';
import { Truck, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            About Shoply
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Crafting Everyday Essentials with Care & Precision
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Founded with a vision to deliver premium quality, sustainably sourced, and authentic lifestyle goods directly to your doorstep.
          </p>
        </div>

        {/* 4 HIGHLIGHT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-gray-900">50K+</span>
            <span className="text-xs text-gray-500 block font-semibold">Happy Customers</span>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-500">100%</span>
            <span className="text-xs text-gray-500 block font-semibold">Genuine Products</span>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-indigo-600">2-Day</span>
            <span className="text-xs text-gray-500 block font-semibold">Express Delivery</span>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600">4.9/5</span>
            <span className="text-xs text-gray-500 block font-semibold">Average Rating</span>
          </div>
        </div>

        {/* OUR STORY & VALUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Our Journey & Mission
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              At Shoply, we believe that modern shopping should be seamless, dependable, and enjoyable. From cold-pressed natural beverages and organic snacks to studio headphones and smart tech wearables, each product in our store is hand-curated to exceed industry benchmarks.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We partner directly with verified manufacturers and artisan creators to ensure unbeatable freshness, verified authenticity, and transparent pricing.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">Uncompromising Quality</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Every batch undergoes rigorous quality testing and packaging standards before reaching your hands.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">Direct & Fast Logistics</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our automated fulfillment centers dispatch orders within 4 hours of payment verification.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-gray-900">Customer Centricity</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our customer experience team is available 6 days a week to assist with order tracking, sizing, and refunds.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
