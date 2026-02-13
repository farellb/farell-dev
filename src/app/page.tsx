

import dynamic from 'next/dynamic';
import { Hero } from '@/components/landing/Hero';

import { CategoryGrid } from '@/components/landing/CategoryGrid';
import { getContentBlocks } from '@/lib/content';

// Dynamic imports for performance
const VisionSection = dynamic(() => import('@/components/landing/VisionSection'), {
  loading: () => <div className="h-screen bg-black" />,
  ssr: true
});

const BrandPhilosophy = dynamic(() => import('@/components/landing/BrandPhilosophy').then(mod => mod.BrandPhilosophy), {
  loading: () => <div className="h-screen bg-white" />,
  ssr: true
});

const MarqueeSection = dynamic(() => import('@/components/landing/MarqueeSection'), {
  ssr: true
});

const StoreSection = dynamic(() => import('@/components/landing/StoreSection').then(mod => mod.StoreSection), {
  loading: () => <div className="h-[80vh] bg-neutral-900" />,
  ssr: true
});

const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), {
  ssr: true
});

export default async function Home() {
  const visionContent = await getContentBlocks('vision');
  const philosophyContent = await getContentBlocks('philosophy');
  const storeContent = await getContentBlocks('store');
  const marqueeContent = await getContentBlocks('marquee');
  const configContent = await getContentBlocks('config');

  let sectionOrder = ["hero", "marquee", "vision", "philosophy", "store", "category_grid"];

  if (configContent['section_order']) {
    try {
      const storedOrder = JSON.parse(configContent['section_order']);
      if (Array.isArray(storedOrder)) {
        sectionOrder = storedOrder;
        // Ensure category_grid is in the list if not present (backward compatibility)
        if (!sectionOrder.includes('category_grid')) {
          sectionOrder.push('category_grid');
        }
      }
    } catch (e) {
      console.error("Failed to parse section order", e);
    }
  }

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'hero':
        return <Hero key="hero" />;
      case 'marquee':
        return <MarqueeSection key="marquee" content={marqueeContent} />;
      case 'vision':
        return <VisionSection key="vision" content={visionContent} />;
      case 'philosophy':
        return <BrandPhilosophy key="philosophy" content={philosophyContent} />;
      case 'store':
        return <StoreSection key="store" content={storeContent} />;
      case 'category_grid':
        return <CategoryGrid key="category_grid" />;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-white">
      {sectionOrder.map(sectionName => renderSection(sectionName))}
      <Footer />
    </main>
  );
}
