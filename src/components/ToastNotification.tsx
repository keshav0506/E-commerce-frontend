import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage, showToast } = useShop();

  // Dismiss on clicking or touching outside
  useEffect(() => {
    const handleDismiss = () => {
      if (toastMessage) {
        showToast('');
      }
    };

    if (toastMessage) {
      document.addEventListener('touchstart', handleDismiss);
    }
    return () => {
      document.removeEventListener('touchstart', handleDismiss);
    };
  }, [toastMessage, showToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={() => showToast('')}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 text-xs sm:text-sm font-semibold cursor-pointer hover:bg-black transition-colors"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-white ml-2 shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

