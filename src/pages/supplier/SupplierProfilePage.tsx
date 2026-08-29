import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  FileCheck2,
  ShieldCheck,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getSupplierProfileApi, updateSupplierProfileApi } from '../../services/supplierService';
import { peekApiCache } from '../../services/api';
import type { SupplierProfile } from '../../types/supplier';

export const SupplierProfilePage: React.FC = () => {
  const cachedProfile = peekApiCache<SupplierProfile>('/supplier/profile');
  const [profile, setProfile] = useState<SupplierProfile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: cachedProfile?.businessName || '',
    phone: cachedProfile?.phone || '',
    businessAddress: cachedProfile?.businessAddress || '',
    city: cachedProfile?.city || '',
    state: cachedProfile?.state || '',
    postalCode: cachedProfile?.postalCode || '',
    category: cachedProfile?.category || 'General Merchandise'
  });

  const fetchProfile = async (isBackground = false) => {
    if (!isBackground && !profile) setLoading(true);
    setError(null);
    try {
      const data = await getSupplierProfileApi();
      setProfile(data);
      setFormData({
        businessName: data.businessName || '',
        phone: data.phone || '',
        businessAddress: data.businessAddress || '',
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postalCode || '',
        category: data.category || 'General Merchandise'
      });
    } catch (err: any) {
      if (!profile) {
        setError(err.message || 'Failed to load supplier profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(!!profile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const updated = await updateSupplierProfileApi(formData);
      setProfile(updated);
      setSuccessMsg('Business profile details updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <p className="font-bold">Loading enterprise supplier credentials...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-gray-900">Profile Unavailable</h3>
        <p className="text-xs text-rose-600">{error || 'Supplier account not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-rose-500" />
          <span>Business Profile & Credentials</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Registered business entity, verified tax identifiers, and contact headquarters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between text-xs text-rose-600 font-bold">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-rose-500 font-bold ml-4 cursor-pointer">✕</button>
        </div>
      )}

      {/* Verified Status Banner */}
      <div className="bg-rose-50/60 border border-rose-100 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-gray-900">{profile.businessName}</h2>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-rose-500 text-white shadow-xs">
                {profile.status}
              </span>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-0.5">
              Verified Wholesale Merchant • GSTIN: <span className="font-mono font-bold">{profile.taxIdentifier}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-[#f3f4f6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Registered Business Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Category / Industry Focus
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Official Business Email (Immutable)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={profile.businessEmail}
                className="w-full pl-10 pr-3 py-3 bg-gray-200/60 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-500 cursor-not-allowed font-mono shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Warehouse / Business Address
            </label>
            <textarea
              required
              rows={2}
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Postal PIN Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Tax ID / GSTIN (Immutable)
            </label>
            <div className="relative">
              <FileCheck2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={profile.taxIdentifier}
                className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-500 cursor-not-allowed font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
