import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { applySupplierApi } from '../../services/supplierService';
import type { SupplierApplyRequest } from '../../types/supplier';

export const SupplierApplyPage: React.FC = () => {
  const [formData, setFormData] = useState<SupplierApplyRequest>({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessEmail: '',
    phone: '',
    businessAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    taxIdentifier: '',
    category: 'Electronics & FMCG'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await applySupplierApi(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit supplier application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Application Submitted</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your supplier application for <span className="font-bold text-gray-900">{formData.businessName}</span> has been received and is under administrative review.
            </p>
          </div>
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Account Email:</span>
              <span className="font-bold text-gray-900">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Tax Identifier:</span>
              <span className="font-mono text-rose-600 font-bold">{formData.taxIdentifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Initial Status:</span>
              <span className="font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 text-[10px]">Pending Review</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            You can sign in to your supplier dashboard once your application has been verified by the procurement desk.
          </p>
          <div className="pt-2">
            <Link
              to="/login?role=supplier"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            >
              Go to Supplier Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-1">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Shoply<span className="text-rose-500">.</span>
            </span>
            <span className="text-xs uppercase font-bold tracking-widest bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100 ml-1">
              Supplier
            </span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Become a Verified Supplier</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            Join the Shoply B2B supply network to fulfill bulk purchase orders directly from certified distribution centers.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-xs text-rose-600 font-bold">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Section 1: User Login Credentials */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              1. Supplier Account Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Contact Person Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Login Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="supplier@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Tax Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              2. Business & Tax Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Registered Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Distributors Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Official Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="procurement@apexglobal.com"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">GSTIN / Tax Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  value={formData.taxIdentifier}
                  onChange={(e) => setFormData({ ...formData, taxIdentifier: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beverages, Electronics, Fashion Apparel"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Warehouse Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Plot/Street Address..."
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login?role=supplier" className="text-rose-600 hover:underline font-bold">
                Log In As Supplier
              </Link>
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all disabled:opacity-50 w-full sm:w-auto cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Submit Onboarding Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
