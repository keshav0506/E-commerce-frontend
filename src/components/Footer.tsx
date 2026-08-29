import React from 'react';
import { Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setSelectedCategoryId } = useShop();
  const navigate = useNavigate();

  const handleCategoryNav = (cat: string) => {
    setSelectedCategoryId(cat);
    navigate('/products');
  };

  return (
    <footer aria-label="Page Footer" className="bg-white border-t border-gray-100 pt-14 pb-10 mt-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-100">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link
              to="/"
              onClick={() => setSelectedCategoryId('all')}
              className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center group cursor-pointer"
            >
              <span>Shoply</span>
              <span className="text-rose-500 group-hover:scale-125 transition-transform">.</span>
            </Link>
            
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">
              Discover cold-pressed organic juice elixirs, artisan snacks, eco-friendly home care, and studio tech essentials delivered with care.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-3 text-gray-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X Twitter" className="p-2 rounded-full bg-gray-50 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-gray-50 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-gray-50 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-gray-50 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <button onClick={() => handleCategoryNav('all')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('all')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('snacks')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  Deals
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('beverages')} className="hover:text-rose-600 transition-colors cursor-pointer">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><Link to="/contact" className="hover:text-rose-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-rose-600 transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-rose-600 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-rose-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-rose-600 transition-colors">About Us</Link></li>
              <li><Link to="/supplier/apply" className="hover:text-emerald-600 transition-colors font-medium text-emerald-600">Become a Supplier</Link></li>
              <li><Link to="/privacy" className="hover:text-rose-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-rose-600 transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="pt-2 text-xs text-gray-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Certified Organic & Safe</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} Shoply Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 font-semibold text-gray-400">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
