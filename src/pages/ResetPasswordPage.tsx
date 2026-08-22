import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const validate = () => {
    let valid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (!hasMinLength || !hasUppercase || !hasNumber) {
      setPasswordError('Password does not meet the requirements.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
              <h2 className="text-2xl font-extrabold text-gray-900">Password updated successfully.</h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                Your password has been changed. You can now sign in with your new password.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md inline-flex items-center justify-center gap-2 transition-all"
              >
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Create a new password
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                Set a strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      passwordError ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-rose-500/20 focus:border-rose-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-rose-500 font-semibold mt-1">{passwordError}</p>}

                {/* Requirements Checklist */}
                <div className="mt-2 space-y-1 text-[11px] text-gray-500">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : ''}`}>
                    <span>{hasMinLength ? '✓' : '○'} At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 font-semibold' : ''}`}>
                    <span>{hasUppercase ? '✓' : '○'} One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-semibold' : ''}`}>
                    <span>{hasNumber ? '✓' : '○'} One number</span>
                  </div>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      confirmPasswordError ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-rose-500/20 focus:border-rose-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-xs text-rose-500 font-semibold mt-1">{confirmPasswordError}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
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
