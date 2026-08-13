import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';

export const metadata: Metadata = {
  title: 'NovaShop — Premium E-Commerce Platform',
  description: 'Discover premium tech, fashion & lifestyle products. Free shipping over $50. Secure checkout powered by Stripe.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
