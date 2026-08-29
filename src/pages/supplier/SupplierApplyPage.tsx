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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Application Submitted</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your supplier application for <span className="font-bold text-white">{formData.businessName}</span> has been received and is under administrative review.
            </p>
          </div>
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Account Email:</span>
              <span className="font-semibold text-white">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tax Identifier:</span>
              <span className="font-mono text-emerald-400 font-bold">{formData.taxIdentifier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Status:</span>
              <span className="font-bold uppercase text-amber-400">Pending Review</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            You can sign in to your supplier dashboard once your application has been verified by the procurement desk.
          </p>
          <div className="pt-2">
            <Link
              to="/login?role=supplier"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
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
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              S
            </div>
            <span className="text-xl font-black text-white">Shoply Enterprise</span>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Become a Verified Supplier</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Join the Shoply B2B supply network to fulfill bulk purchase orders directly from certified distribution centers.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Section 1: User Login Credentials */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              1. Supplier Account Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Login Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="supplier@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Tax Details */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              2. Business & Tax Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Distributors Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="procurement@apexglobal.com"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GSTIN / Tax Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  value={formData.taxIdentifier}
                  onChange={(e) => setFormData({ ...formData, taxIdentifier: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beverages, Electronics, Fashion Apparel"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Warehouse Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Plot/Street Address..."
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login?role=supplier" className="text-emerald-400 hover:underline font-semibold">
                Log In As Supplier
              </Link>
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 w-full sm:w-auto"
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
