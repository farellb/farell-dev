'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

const CATEGORIES = [
    {
        id: 'men',
        label: 'Kişi',
        href: '/category/men',
        image: '/cat-men.png',
        alt: 'Farell Brooklyn Men Collection',
        style: { objectPosition: 'top' }
    },
    {
        id: 'women',
        label: 'Qadın',
        href: '/category/women',
        image: '/cat-women.png',
        alt: 'Farell Brooklyn Women Collection',
        style: { objectPosition: 'top' }
    },
    {
        id: 'kids',
        label: 'Uşaq',
        href: '/category/kids',
        image: '/cat-kids.png',
        alt: 'Farell Brooklyn Kids Collection',
        style: { objectPosition: 'center' }
    },
    {
        id: 'accessories',
        label: 'Aksesuar',
        href: '/category/accessories',
        image: '/cat-acc.png',
        alt: 'Farell Brooklyn Accessories',
        style: { objectPosition: 'center' }
    }
];

export function CategoryGrid() {
    return (
        <section className="w-full min-h-screen bg-black">
            <div className="w-full h-full grid grid-cols-2">
                {CATEGORIES.map((category, index) => (
                    <Link
                        key={category.id}
                        href={category.href}
                        className={`relative w-full h-[50vh] group overflow-hidden
                            ${index % 2 === 0 ? 'border-r border-white/10' : ''}
                            ${index < 2 ? 'border-b border-white/10' : ''}
                        `}
                    >
                        {/* Arxa Fon Şəkli */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={category.image}
                                alt={category.alt}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                style={category.style}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                        </div>

                        {/* Məzmun */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">

                            {/* Yuxarı Sağ Ox */}
                            <div className="self-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-white">
                                <ArrowUpRight size={32} weight="light" />
                            </div>

                            {/* Aşağı Etiket */}
                            <div className="transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h2 className="text-4xl lg:text-5xl font-normal uppercase tracking-tighter text-white">
                                    {category.label}
                                </h2>
                                <div className="h-px w-0 group-hover:w-full bg-white mt-4 transition-all duration-700 ease-in-out" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
