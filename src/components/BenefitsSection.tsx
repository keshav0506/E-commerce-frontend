import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

interface BenefitItem {
  id: string;
  iconName: 'Truck' | 'RotateCcw' | 'ShieldCheck' | 'Headphones';
  title: string;
  subtitle: string;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'benefit-1',
    iconName: 'Truck',
    title: 'Free Express Shipping',
    subtitle: 'On orders over ₹499'
  },
  {
    id: 'benefit-2',
    iconName: 'RotateCcw',
    title: '7-Day Easy Returns',
    subtitle: 'Hassle-free refunds & pickups'
  },
  {
    id: 'benefit-3',
    iconName: 'ShieldCheck',
    title: '100% Safe Payments',
    subtitle: '256-bit SSL secured checkout'
  },
  {
    id: 'benefit-4',
    iconName: 'Headphones',
    title: '24/7 Priority Support',
    subtitle: 'Dedicated customer care desk'
  }
];

export const BenefitsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-gray-900" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-gray-900" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-gray-900" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-gray-900" />;
      default:
        return <Truck className="w-5 h-5 text-gray-900" />;
    }
  };

  return (
    <section aria-label="Customer Benefits" id="benefits-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#f8f9fa] border border-gray-200/60 rounded-2xl py-5 px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="flex items-center space-x-3.5 p-1 transition-transform duration-200 hover:translate-x-1"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-gray-100 shrink-0">
                {getIcon(benefit.iconName)}
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                  {benefit.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-normal">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
