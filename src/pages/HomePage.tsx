import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FlashSaleBanner } from '../components/FlashSaleBanner';
import { SpecialDealsSection } from '../components/SpecialDealsSection';
import { BenefitsSection } from '../components/BenefitsSection';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 space-y-3">
      {/* Flipkart-Style Multi-Banner Carousel + Mini Deals Strip */}
      <HeroCarousel />

      {/* Wide Flash Sale & Special Offers Big Banner */}
      <FlashSaleBanner />

      {/* Special Deals Card-Structured Sections */}
      <SpecialDealsSection />

      {/* Benefits Strip */}
      <BenefitsSection />
    </main>
  );
};
