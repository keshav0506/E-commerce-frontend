import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, PackageCheck, Truck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const orderNumber = `#ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="min-h-[85vh] bg-[#fcfcfc] flex items-center justify-center p-4 sm:p-6 text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-center space-y-6"
      >
        {/* Checkmark Animation Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title & Order Info */}
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 font-extrabold text-xs rounded-full border border-emerald-100 uppercase tracking-wider mb-2">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order placed successfully!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Thank you for your order. We've received your request and started processing it.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-5 space-y-3 text-xs text-left">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Order Reference</span>
            <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-rose-500" />
              Estimated Delivery
            </span>
            <span className="font-bold text-emerald-600">3–5 Business Days</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-rose-500" />
              Status
            </span>
            <span className="font-bold text-gray-900">Processing</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/products"
            className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <button
            disabled
            className="flex-1 py-3.5 bg-gray-100 text-gray-400 rounded-2xl font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
            title="Order history will be available in future steps"
          >
            <span>View Order Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
