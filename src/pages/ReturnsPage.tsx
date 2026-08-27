import React from 'react';
import { Link } from 'react-router-dom';

export const ReturnsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Buyer Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Returns & Refund Policy
          </h1>
          <p className="text-sm text-gray-500">
            Hassle-free 7-day return policy with transparent, instant refunds.
          </p>
        </div>

        {/* 3 RETURN PROCESS STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="text-sm font-extrabold text-gray-900">Request Return</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Initiate a return within 7 days of delivery from your Account or via Support.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-black text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="text-sm font-extrabold text-gray-900">Doorstep Pickup</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our courier will pick up the item in original packaging with tags intact.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="text-sm font-extrabold text-gray-900">Instant Refund</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Refund is credited directly back to your original payment method or bank account.
            </p>
          </div>
        </div>

        {/* DETAILED RETURN TERMS */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">1. Eligibility for Returns</h3>
            <p>
              Items are eligible for return or replacement within 7 calendar days of receipt if they arrive damaged, defective, expired, or significantly different from description. The product must be unused, unwashed, and in its original retail packaging with all manufacturer tags intact.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">2. Non-Returnable Items</h3>
            <p>
              For health, hygiene, and safety compliance, opened food products, cold-pressed beverages, intimate apparel, and personal hygiene items cannot be returned unless verified as defective or damaged upon delivery.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">3. Refund Methods & Timelines</h3>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="font-semibold text-gray-700">UPI / Wallet Payments</span>
                <span className="font-bold text-emerald-600">Instant to 2 Hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="font-semibold text-gray-700">Credit / Debit Cards</span>
                <span className="font-bold text-gray-900">3 to 5 Business Days</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-gray-700">Cash on Delivery (COD)</span>
                <span className="font-bold text-gray-900">Direct NEFT to Bank / UPI ID</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT CTA */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-3">
          <h3 className="text-base font-extrabold text-gray-900">Need help with an existing order?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Contact our returns desk directly for instant resolution or replacement dispatch.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link
              to="/account"
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-xs transition-colors"
            >
              Order History
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs transition-colors"
            >
              Contact Desk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
