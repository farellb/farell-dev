import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';
import { BrandPhilosophy } from '@/components/landing/BrandPhilosophy';
import { CategoryGrid } from '@/components/landing/CategoryGrid';
import VisionSection from '@/components/landing/VisionSection';
import { StoreSection } from '@/components/landing/StoreSection';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <Hero />
      <VisionSection />
      <BrandPhilosophy />
      <CategoryGrid />
      <StoreSection />
    </main>
  );
}
