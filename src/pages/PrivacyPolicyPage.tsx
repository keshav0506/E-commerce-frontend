import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Legal & Security
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: August 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">1. Information We Collect</h3>
            <p>
              When you use Shoply, we collect information you provide directly to us, including your name, email address, phone number, delivery addresses, and order history. We do not store raw credit/debit card details on our servers; all payment transactions are handled through certified PCI-DSS Level 1 payment partners.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">2. How We Use Your Information</h3>
            <p>
              We utilize collected information to process and deliver your orders, send order confirmations and shipment tracking alerts, provide customer support, and detect and prevent fraudulent transactions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">3. Data Security & Encryption</h3>
            <p>
              We implement industry-standard 256-bit SSL encryption protocols across our entire platform to protect the confidentiality and integrity of your personal information during transmission and storage.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">4. Third-Party Sharing</h3>
            <p>
              We never sell, rent, or lease your personal information to third-party advertisers. We only share necessary delivery details with our trusted logistics and courier partners strictly for order fulfillment purposes.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">5. Your Privacy Rights</h3>
            <p>
              You have the right to access, modify, or delete your account information at any time from your Account settings or by contacting our data privacy officer at privacy@shoply.com.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
