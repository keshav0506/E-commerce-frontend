import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Package, CreditCard, Truck, RotateCcw, ShieldCheck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
  category: 'orders' | 'shipping' | 'payments' | 'returns' | 'account';
}

const FAQS: FaqItem[] = [
  {
    category: 'orders',
    question: 'How do I place an order on Shoply?',
    answer: 'Simply browse our catalog, select your desired variant/volume, and click "Add to Cart". Once you are ready, click on your cart or proceed to checkout, enter your shipping address, choose your payment method (Razorpay Cards, UPI, Netbanking, or Cash on Delivery), and confirm your order.'
  },
  {
    category: 'orders',
    question: 'How can I track my shipment status?',
    answer: 'Once your order is placed, you can visit your "Account > Order History" page to view real-time status updates (Placed, Processing, Dispatched, Delivered). You will also receive SMS and email notifications with the tracking AWB number.'
  },
  {
    category: 'shipping',
    question: 'What are the delivery timelines & charges?',
    answer: 'We offer standard express delivery within 2-4 business days across all major Indian cities. Orders above ₹499 qualify for Free Shipping. Orders below ₹499 incur a standard nominal delivery fee of ₹40.'
  },
  {
    category: 'shipping',
    question: 'Do you deliver to my pincode?',
    answer: 'We deliver to over 19,000+ pincodes across India via our trusted logistics network. You can check instant availability by typing your 6-digit pincode on any product page.'
  },
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Credit/Debit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and Cash on Delivery (COD).'
  },
  {
    category: 'payments',
    question: 'Are my online payments secure?',
    answer: 'Yes, 100%. All card transactions and UPI payments are processed securely through RBI-approved payment gateways with 256-bit SSL encryption and 3D Secure OTP verification.'
  },
  {
    category: 'returns',
    question: 'What is your return & refund policy?',
    answer: 'We offer a 7-day hassle-free return window for eligible products if they are received damaged, defective, or incorrect. Once returned and inspected, your full refund is processed instantly to your original payment source or within 3-5 business days.'
  },
  {
    category: 'returns',
    question: 'How do I initiate a return or replacement?',
    answer: 'Go to "Account > Order History", find your order, and click "Request Return" or contact our customer support team at keshavkhandelwal240@gmail.com with your Order ID and product photos.'
  },
  {
    category: 'account',
    question: 'How do I update my profile or delivery address?',
    answer: 'Log in to your account, navigate to the "Account" section, and click on "Saved Addresses" to add, edit, or set default delivery locations for quick checkout.'
  }
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'orders', label: 'Orders & Tracking', icon: Package },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payments', label: 'Payments & COD', icon: CreditCard },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'account', label: 'Account & Security', icon: ShieldCheck }
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500">
            Find answers to common questions about orders, payments, shipping, and returns.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords (e.g. tracking, refund, COD, delivery)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 shadow-xs focus:outline-hidden focus:border-rose-500 transition-colors"
          />
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setExpandedIndex(0);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQS ACCORDION LIST */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 space-y-2">
              <p className="text-sm font-bold text-gray-800">No matching questions found</p>
              <p className="text-xs text-gray-400">Try searching for something else or contact support directly.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-rose-500' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* STILL HAVE QUESTIONS FOOTER CALLOUT */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-3">
          <h3 className="text-base font-extrabold text-gray-900">Still have questions?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Our customer experience specialists are happy to assist you with any questions.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-md transition-colors"
          >
            <span>Contact Support</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
