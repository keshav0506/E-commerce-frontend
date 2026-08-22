import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { SpecialDealsSection } from '../components/SpecialDealsSection';
import { PromotionalSection } from '../components/PromotionalSection';
import { BenefitsSection } from '../components/BenefitsSection';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 space-y-4">
      {/* Dynamic Hero Carousel */}
      <HeroCarousel />

      {/* Special Deals Card-Structured Sections */}
      <SpecialDealsSection />

      {/* 3 Promotional Offer Banners */}
      <PromotionalSection />

      {/* Benefits Strip */}
      <BenefitsSection />
    </main>
  );
};
