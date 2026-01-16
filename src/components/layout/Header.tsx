'use client';

import Image from 'next/image';
import Link from 'next/link';
import { List, X, ShoppingBag } from '@phosphor-icons/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/category/men', label: 'Kişi' },
  { href: '/category/women', label: 'Qadın' },
  { href: '/category/kids', label: 'Uşaq' },
  { href: '/category/accessories', label: 'Aksessuar' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobil Menyu Düyməsi */}
        <button
          className="md:hidden p-2 -ml-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {/* Loqo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-32 md:h-12 md:w-40">
            <Image
              src="/logo.png"
              alt="Farell Brooklyn"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-contain object-left md:object-center"
              priority
            />
          </div>
        </Link>

        {/* Masaüstü Naviqasiya */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sağ Hissə (Səbət/Sorğu) */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag size={24} weight="regular" />
            {/* Bildiriş sayı */}
          </Button>
        </div>
      </div>

      {/* Mobil Menyu Örtüyü */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium py-2 border-b border-gray-100 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
