"use client";

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';

// Ekranın aşağı hissəsindəki komponentlər üçün lazy load
const VisionSection = dynamic(() => import('@/components/landing/VisionSection'), {
  loading: () => <div className="h-[250vh] bg-black" />,
  ssr: true
});

const BrandPhilosophy = dynamic(
  () => import('@/components/landing/BrandPhilosophy').then(mod => ({ default: mod.BrandPhilosophy })),
  {
    loading: () => <div className="h-[600px] bg-white" />,
    ssr: true
  }
);

const CategoryGrid = dynamic(
  () => import('@/components/landing/CategoryGrid').then(mod => ({ default: mod.CategoryGrid })),
  {
    loading: () => <div className="h-screen bg-black" />,
    ssr: true
  }
);

const MarqueeSection = dynamic(() => import('@/components/landing/MarqueeSection'), {
  loading: () => <div className="h-32 bg-white" />,
  ssr: true
});

const StoreSection = dynamic(
  () => import('@/components/landing/StoreSection').then(mod => ({ default: mod.StoreSection })),
  {
    loading: () => <div className="h-[80vh] bg-neutral-900" />,
    ssr: true
  }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })),
  {
    loading: () => <div className="h-96 bg-white" />,
    ssr: true
  }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <Hero />
      <VisionSection />
      <BrandPhilosophy />
      <CategoryGrid />
      <MarqueeSection />
      <StoreSection />
      <Footer />
    </main>
  );
}
