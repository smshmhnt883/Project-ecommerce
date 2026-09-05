import { HeroSection } from '@/components/home/HeroSection';
import { TrustBar } from '@/components/home/TrustBar';
import { CategorySection } from '@/components/home/CategorySection';
import { ConcernSection } from '@/components/home/ConcernSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { AyurvedaStorySection } from '@/components/home/AyurvedaStorySection';
import { CombosSection } from '@/components/home/CombosSection';
import { IngredientSpotlightSection } from '@/components/home/IngredientSpotlightSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Indicators Bar */}
      <TrustBar />

      {/* 3. Shop by Category */}
      <CategorySection />

      {/* 4. Shop by Concern */}
      <ConcernSection />

      {/* 5. Featured Products */}
      <FeaturedSection />

      {/* 6. Bestsellers with Category Tabs */}
      <BestsellersSection />

      {/* 7. Editorial Ayurveda Section */}
      <AyurvedaStorySection />

      {/* 8. Curated Combos & Gifting */}
      <CombosSection />

      {/* 9. Ingredient / Natural Wellness Section */}
      <IngredientSpotlightSection />

      {/* 10. Customer Reviews / Social Proof */}
      <TestimonialsSection />

      {/* 11. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
