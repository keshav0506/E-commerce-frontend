import React from 'react';
import { Truck, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Logistics & Delivery
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-gray-500">
            Fast, secure, and reliable nationwide delivery directly to your doorstep.
          </p>
        </div>

        {/* 3 HIGHLIGHT DELIVERY TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">Free Express Shipping</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Available on all orders above ₹499. Orders below ₹499 carry a flat ₹40 fee.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">2-4 Days Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dispatched within 24 hours via premium express couriers (Bluedart, Delhivery).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-gray-900">19,000+ Pincodes</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Comprehensive pan-India coverage with end-to-end live GPS tracking.
            </p>
          </div>
        </div>

        {/* DETAILED GUIDELINES */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">1. Order Processing Timeline</h3>
            <p>
              All confirmed orders are processed and packed in our climate-controlled fulfillment hubs within 4 to 24 business hours. Orders placed on Sundays or national holidays are dispatched on the next working business day.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">2. Real-Time Tracking & Notifications</h3>
            <p>
              Once your parcel is handed over to the courier partner, you will receive an instant SMS and email with your Airway Bill (AWB) number and direct live tracking link. You can also monitor your package at any time from your Account Order History page.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">3. Tamper-Proof & Eco-Friendly Packaging</h3>
            <p>
              We ensure all sensitive items, glass bottles, and electronic wearables are secured inside multi-layer shockproof corrugated boxes with security tamper seals. If you notice any visible outer box damage upon delivery, please do not accept the package and notify us immediately.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">4. Cash on Delivery (COD)</h3>
            <p>
              COD is available for eligible pincodes up to orders worth ₹5,000. You can pay via Cash or scan the delivery agent's UPI QR code at your doorstep.
            </p>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="text-center pt-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
          >
            <span>Start Shopping Now</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
