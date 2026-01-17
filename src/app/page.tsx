import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';
import { BrandPhilosophy } from '@/components/landing/BrandPhilosophy';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <Hero />
      <BrandPhilosophy />
    </main>
  );
}
