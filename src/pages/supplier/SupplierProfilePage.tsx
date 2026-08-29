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
import type { SupplierProfile } from '../../types/supplier';

export const SupplierProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    businessAddress: '',
    city: '',
    state: '',
    postalCode: '',
    category: ''
  });

  const fetchProfile = async () => {
    setLoading(true);
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
      setError(err.message || 'Failed to load supplier profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p>Loading enterprise supplier credentials...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Profile Unavailable</h3>
        <p className="text-xs text-rose-300">{error || 'Supplier account not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Business Profile & Credentials</h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered business entity, verified tax identifiers, and contact headquarters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Verified Status Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{profile.businessName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-500 text-slate-950">
                {profile.status}
              </span>
            </div>
            <p className="text-xs text-emerald-300 mt-0.5">
              Verified Wholesale Merchant • GSTIN: <span className="font-mono">{profile.taxIdentifier}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Registered Business Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Category / Industry Focus
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Official Business Email (Immutable)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={profile.businessEmail}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Warehouse / Business Address
            </label>
            <textarea
              required
              rows={2}
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Postal PIN Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tax ID / GSTIN (Immutable)
            </label>
            <div className="relative">
              <FileCheck2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={profile.taxIdentifier}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs text-slate-400 cursor-not-allowed font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
