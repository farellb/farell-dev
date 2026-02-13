'use client';

import Link from 'next/link';
import Image from 'next/image';
import { List, X, ShoppingBag, MagnifyingGlass, Plus, Minus, ArrowRight } from '@phosphor-icons/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuCategory } from '@/lib/menu-data';
import { MegaMenu } from './MegaMenu';

import { usePathname } from 'next/navigation';

interface HeaderProps {
  menuData?: MenuCategory[];
}

export function Header({ menuData }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide Header on Admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Use passed data or fallback to empty array (never static data)
  const categories = menuData || [];

  // Mega Menu State (Desktop)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Mobil Menyu Vəziyyəti (State)
  const [mobileTab, setMobileTab] = useState(categories[0]?.label || '');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleAccordion = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const activeCategory = categories.find(c => c.label === mobileTab);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
      onMouseLeave={() => setHoveredCategory(null)} // Header-dən çıxanda bağla
    >
      <div className="container mx-auto flex h-24 items-center justify-center md:justify-between px-4 md:px-6 relative z-50 bg-transparent">
        {/* Mobil Menyu Düyməsi */}
        <button
          className="md:hidden absolute left-4 p-2 -ml-2 text-foreground z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <List size={26} />}
        </button>

        {/* 1. Sol: Naviqasiya */}
        <nav className="hidden md:flex gap-8 items-center w-1/3 h-full">
          {categories.map((category) => (
            <div
              key={category.href}
              className="h-full flex items-center group relative cursor-pointer"
              onMouseEnter={() => setHoveredCategory(category.label)}
            >
              <Link
                href={category.href}
                className={cn(
                  "text-[13px] font-medium uppercase tracking-widest transition-colors py-4 inline-block relative",
                  "text-muted-foreground hover:text-foreground", // Rəng keçidlərini sadələşdirdim
                  hoveredCategory === category.label && "text-foreground"
                )}
              >
                {category.label}
                {/* Underline Animation */}
                <span className={cn(
                  "absolute bottom-2 left-0 w-full h-[1.5px] bg-black transform scale-x-0 transition-transform duration-300 ease-out origin-left",
                  (hoveredCategory === category.label) && "scale-x-100"
                )} />
              </Link>
            </div>
          ))}
        </nav>

        {/* 2. Mərkəz: Loqo */}
        <div className="flex justify-center md:flex-1 md:w-1/3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-16 w-48 md:h-20 md:w-64">
              <Image
                src="/logo.svg"
                alt="Farell Brooklyn"
                fill
                sizes="(max-width: 768px) 192px, 256px"
                className="object-contain object-center scale-125"
                priority
              />
            </div>
          </Link>
        </div>

        {/* 3. Sağ: İkonlar (Axtarış, Səbət) */}
        <div className="absolute right-4 flex items-center gap-3 md:gap-5 md:static md:w-1/3 md:justify-end">
          <Button variant="ghost" size="icon" className="group hover:bg-transparent">
            <MagnifyingGlass size={26} weight="regular" className="transition-transform group-hover:scale-110" />
          </Button>
          <Button variant="ghost" size="icon" className="relative group hover:bg-transparent">
            <ShoppingBag size={26} weight="regular" className="transition-transform group-hover:scale-110" />
            {/* Badge bura əlavə edilə bilər */}
          </Button>
        </div>
      </div>

      {/* Mega Menu Overlay (Desktop) */}
      <MegaMenu
        category={categories.find(c => c.label === hoveredCategory) || null}
        isOpen={!!hoveredCategory}
        onMouseEnter={() => { }} // Menyu daxilində olanda açıq qalsın
        onMouseLeave={() => setHoveredCategory(null)}
      />

      {/* Mobil Menyu (Tabs + Accordion Design) */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-24 left-0 w-full bg-background h-[calc(100vh-96px)] animate-in slide-in-from-left-2 z-40 flex flex-col overflow-hidden">

          {/* Tabs Navigation */}
          <div className="flex w-full border-b overflow-x-auto no-scrollbar shrink-0">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setMobileTab(category.label)}
                className={cn(
                  "flex-1 py-4 text-xs font-bold uppercase tracking-widest text-center whitespace-nowrap px-4 border-b-2 transition-colors",
                  mobileTab === category.label
                    ? "border-black text-foreground"
                    : "border-transparent text-muted-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-6 pb-20">
            <div className="flex flex-col gap-0">

              {activeCategory?.subcategories.map((sub, index) => {
                const isExpanded = expandedItems.includes(sub.title);

                // 1. Başlıq yoxdursa (Yeni Gələnlər kimi) - Birbaşa linklər
                if (!sub.title) {
                  return (
                    <div key={index} className="flex flex-col gap-4 border-b pb-6 mb-4 last:border-0 last:pb-0 last:mb-0">
                      {sub.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-[15px] font-medium uppercase tracking-wide text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  );
                }

                // 2. Başlıq varsa (Geyim, Ayaqqabı) - Accordion
                return (
                  <div key={index} className="py-0">
                    <button
                      onClick={() => toggleAccordion(sub.title)}
                      className="flex items-center justify-between w-full py-3 uppercase text-[13px] font-bold tracking-widest text-foreground hover:opacity-70 transition-opacity"
                    >
                      {sub.title}
                      {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isExpanded ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"
                      )}
                    >
                      <ul className="flex flex-col gap-2 pl-2 pb-2">
                        {sub.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-sm text-muted-foreground hover:text-foreground capitalize"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Vizual Sahə - Mobil üçün Seçilmiş Şəkil (Featured Image) */}
            {activeCategory?.featuredImage && (
              <Link
                href={`${activeCategory.href}/new`}
                onClick={() => setIsMenuOpen(false)}
                className="mt-8 rounded-lg overflow-hidden relative aspect-video w-full animate-in fade-in slide-in-from-bottom-4 duration-700 shrink-0 block"
              >
                <Image
                  src={activeCategory.featuredImage}
                  alt={`${activeCategory.label} Collection`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />

                {/* "Yeni Gələnlər" Label Bar under image (overlay style matching desktop) */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 py-3 px-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-black">
                    {activeCategory.label} ÜÇÜN YENİ
                  </span>
                  <ArrowRight size={16} className="text-black" />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
