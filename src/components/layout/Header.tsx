'use client';

import Image from 'next/image';
import Link from 'next/link';
import { List, X, ShoppingBag, MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/category/men', label: 'Kişi' },
  { href: '/category/women', label: 'Qadın' },
  { href: '/category/kids', label: 'Uşaq' },
  { href: '/category/accessories', label: 'Aksesuar' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-center md:justify-between px-4 md:px-6 relative">
        {/* Mobil Menyu Düyməsi */}
        <button
          className="md:hidden absolute left-4 p-2 -ml-2 text-foreground z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <List size={26} />}
        </button>

        {/* 1. Sol: Naviqasiya (Yalnız Desktop) */}
        <nav className="hidden md:flex gap-8 items-center w-1/3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-widest transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
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

      {/* Mobil Menyu */}
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
