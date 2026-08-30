import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FlashSaleBanner } from '../components/FlashSaleBanner';
import { SpecialDealsSection } from '../components/SpecialDealsSection';
import { BenefitsSection } from '../components/BenefitsSection';
import { PageMeta } from '../components/PageMeta';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 space-y-3">
      <PageMeta
        title="Shoply - Premium Online Shopping & B2B Wholesale Marketplace"
        description="Explore exclusive deals on gourmet snacks, single-origin coffee, lifestyle fashion, and organic wellness essentials. Fast shipping & verified reviews."
      />
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
