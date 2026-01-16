import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <Hero />
    </main>
  );
}
