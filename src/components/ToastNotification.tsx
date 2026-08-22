import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useShop();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 text-sm font-semibold"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
