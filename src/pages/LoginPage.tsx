import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Sparkles, CheckCircle2, User, ShieldCheck, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useShop();

  const queryParams = new URLSearchParams(location.search);
  const initialRoleParam = queryParams.get('role')?.toUpperCase();

  const DEFAULT_CREDENTIALS = {
    CUSTOMER: { email: 'user@ecommerce.com', password: 'user123' },
    SUPPLIER: { email: 'supplier@ecommerce.com', password: 'supplier123' },
    ADMIN: { email: 'admin@ecommerce.com', password: 'admin123' }
  };

  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'SUPPLIER' | 'ADMIN'>(() => {
    if (initialRoleParam === 'SUPPLIER') return 'SUPPLIER';
    if (initialRoleParam === 'ADMIN') return 'ADMIN';
    return 'CUSTOMER';
  });

  const [email, setEmail] = useState(() => {
    const initialRole = initialRoleParam === 'SUPPLIER' ? 'SUPPLIER' : initialRoleParam === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    return DEFAULT_CREDENTIALS[initialRole].email;
  });
  const [password, setPassword] = useState(() => {
    const initialRole = initialRoleParam === 'SUPPLIER' ? 'SUPPLIER' : initialRoleParam === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    return DEFAULT_CREDENTIALS[initialRole].password;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRoleSelect = (role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN') => {
    setSelectedRole(role);
    setGeneralError('');
    setEmailError('');
    setPasswordError('');
    setEmail(DEFAULT_CREDENTIALS[role].email);
    setPassword(DEFAULT_CREDENTIALS[role].password);
  };

  // Errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters.');
      valid = false;
    }

    return valid;
  };

  const handleRedirectAfterLogin = () => {
    const redirectParam = new URLSearchParams(location.search).get('redirect') || (location.state as any)?.from;
    const savedUserStr = localStorage.getItem('shoply_user');
    const parsed = savedUserStr ? JSON.parse(savedUserStr) : null;
    const role = (parsed?.role || selectedRole).toUpperCase();

    if (role === 'SUPPLIER' || role === 'ROLE_SUPPLIER') {
      navigate('/supplier');
    } else if (role === 'ADMIN' || role === 'ROLE_ADMIN' || redirectParam?.startsWith('/admin')) {
      navigate(redirectParam || '/admin');
    } else {
      navigate(redirectParam || '/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        showToast(`Signed in as ${selectedRole.toLowerCase()} successfully!`);
        handleRedirectAfterLogin();
      } else {
        setGeneralError('Invalid email, password, or role. Please try again.');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Invalid email, password, or role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    setGeneralError('');
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        showToast('Signed in with Google successfully!');
        handleRedirectAfterLogin();
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  const fillCredentials = (roleType: 'user' | 'supplier' | 'admin') => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    if (roleType === 'admin') {
      setSelectedRole('ADMIN');
      setEmail('admin@ecommerce.com');
      setPassword('admin123');
    } else if (roleType === 'supplier') {
      setSelectedRole('SUPPLIER');
      setEmail('supplier@ecommerce.com');
      setPassword('supplier123');
    } else {
      setSelectedRole('CUSTOMER');
      setEmail('user@ecommerce.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#fcfcfc] flex items-center justify-center p-4 sm:p-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
      >
        {/* Left Branding Visual Card (Desktop) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              Shoply Member Access
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Enjoy Exclusive Deals & Perks
            </h2>
            <p className="text-xs text-white/90 leading-relaxed">
              Sign in to manage your orders, save wishlists across devices, and unlock members-only express checkout.
            </p>
          </div>

          <div className="relative z-10 space-y-2 text-xs font-medium text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Fast 1-click checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Order tracking & digital receipts</span>
            </div>
          </div>

          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Authentication Form */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select your role and sign in to access your portal.
            </p>
          </div>

          {/* Segmented Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Sign In As
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('CUSTOMER')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'CUSTOMER'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Customer
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('SUPPLIER')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'SUPPLIER'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Supplier
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'ADMIN'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Localhost Quick Fill Buttons */}
          {isLocalhost && (
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  Quick Fill for Testing (Localhost Only)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('user')}
                  className="py-1.5 px-2 bg-white hover:bg-amber-100/50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <User className="w-3 h-3 text-amber-700" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('supplier')}
                  className="py-1.5 px-2 bg-white hover:bg-amber-100/50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Building2 className="w-3 h-3 text-emerald-700" />
                  <span>Supplier</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="py-1.5 px-2 bg-white hover:bg-amber-100/50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          )}

          {generalError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-600">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                {selectedRole === 'SUPPLIER' ? 'Supplier Business Email' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder={selectedRole === 'SUPPLIER' ? 'supplier@ecommerce.com' : 'name@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-gray-200 focus:ring-rose-500/20 focus:border-rose-500'
                  }`}
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {emailError && <p className="text-xs text-rose-500 font-semibold mt-1">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-2xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    passwordError
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-gray-200 focus:ring-rose-500/20 focus:border-rose-500'
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
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 h-4 w-4"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95 ${
                selectedRole === 'SUPPLIER'
                  ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 shadow-emerald-600/20'
                  : selectedRole === 'ADMIN'
                  ? 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 shadow-slate-900/20'
                  : 'bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in as {selectedRole.toLowerCase()}...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Google Sign-in with Firebase (Present across all login options) */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-bold">OR</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isGoogleLoading || isLoading}
            onClick={handleSocialLogin}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed border border-gray-200 text-gray-800 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Bottom Prompts */}
          <div className="pt-2 text-center text-xs text-gray-500 space-y-2">
            {selectedRole === 'SUPPLIER' ? (
              <p>
                Want to sell wholesale on Shoply?{' '}
                <Link to="/supplier/apply" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Apply for Supplier Account
                </Link>
              </p>
            ) : selectedRole === 'CUSTOMER' ? (
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
                  Create Account
                </Link>
              </p>
            ) : (
              <p className="text-gray-400">
                Authorized administrative personnel only.
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
