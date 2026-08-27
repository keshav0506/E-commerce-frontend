import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Terms of Use
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Please read these terms carefully before accessing or using Shoply.
          </p>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">1. Acceptance of Terms</h3>
            <p>
              By accessing, browsing, or purchasing products on Shoply ("the Platform"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">2. Product Descriptions & Pricing</h3>
            <p>
              We strive to ensure all product specifications, images, and prices are accurate. However, in the event of an inadvertent technical error or pricing discrepancy, we reserve the right to cancel or adjust orders with prior notice and immediate full refund.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">3. User Accounts & Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials, password, and for restricting access to your computer or mobile device. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">4. Intellectual Property</h3>
            <p>
              All content, trademarks, logos, graphics, icons, and software on this platform are the property of Shoply Inc. and are protected by applicable intellectual property rights and copyright laws.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-gray-900">5. Governing Law & Jurisdiction</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
