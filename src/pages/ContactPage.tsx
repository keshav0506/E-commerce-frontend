import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order & Delivery Support');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiFetch<{ success: boolean; message: string; ticketId: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });
      setTicketId(res.ticketId || 'TKT-' + Math.floor(1000 + Math.random() * 9000));
      showToast('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Customer Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Have a question about an order, shipment, or refund? Send us a message and our support team will respond within 24 hours.
          </p>
        </div>

        {/* 3 QUICK CONTACT TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-gray-900">Email Us</h4>
              <a href="mailto:keshavkhandelwal300@gmail.com" className="text-xs text-gray-600 hover:text-rose-600 font-semibold mt-0.5 block truncate">
                keshavkhandelwal300@gmail.com
              </a>
              <span className="text-[11px] font-semibold text-rose-600">Response within 24h</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-gray-900">Phone Support</h4>
              <a href="tel:+919026230270" className="text-xs text-gray-600 hover:text-indigo-600 font-semibold mt-0.5 block">
                +91 9026230270
              </a>
              <span className="text-[11px] font-semibold text-indigo-600">Mon - Sat: 9 AM - 8 PM</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-gray-900">Headquarters</h4>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">Chandigarh, India</p>
              <span className="text-[11px] font-semibold text-emerald-600">Corporate & Support Center</span>
            </div>
          </div>
        </div>

        {/* CONTACT FORM + FAQ PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CONTAINER */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Send a Message</h3>
                <p className="text-xs text-gray-400">Fill the form below to create a support ticket.</p>
              </div>
            </div>

            {ticketId && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs font-semibold">
                  <span>Ticket Created: </span>
                  <span className="font-extrabold">{ticketId}</span>
                  <span className="block text-emerald-600 text-[11px] mt-0.5">Our support engineers have received your inquiry.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Keshav Khandelwal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500 cursor-pointer"
                >
                  <option value="Order & Delivery Support">Order & Delivery Support</option>
                  <option value="Product & Sizing Inquiry">Product & Sizing Inquiry</option>
                  <option value="Payment & Invoice Question">Payment & Invoice Question</option>
                  <option value="Return & Refund Request">Return & Refund Request</option>
                  <option value="Partnership & Vendor Inquiry">Partnership & Vendor Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Support Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT INFORMATION CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Operating Hours</h4>
                  <p className="text-xs text-gray-400">Customer experience center</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-semibold text-gray-700">Monday - Friday</span>
                  <span className="font-bold text-gray-900">9:00 AM - 8:00 PM IST</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-semibold text-gray-700">Saturday</span>
                  <span className="font-bold text-gray-900">10:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-gray-700">Sunday</span>
                  <span className="font-bold text-emerald-600">Email & Ticket Support</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider">100% Buyer Protection</h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                All transactions are encrypted with 256-bit SSL security. Enjoy hassle-free 7-day returns on eligible items.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
