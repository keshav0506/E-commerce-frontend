import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] bg-[#fcfcfc] flex items-center justify-center p-4 sm:p-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6"
      >
        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Check your email</h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                We've sent a password reset link to <strong className="text-gray-800">{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-md inline-flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter the email associated with your account and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      emailError ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-rose-500/20 focus:border-rose-500'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {emailError && <p className="text-xs text-rose-500 font-semibold mt-1">{emailError}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-rose-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
