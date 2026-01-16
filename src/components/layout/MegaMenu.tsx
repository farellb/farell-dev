'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MenuCategory } from '@/lib/menu-data';
import { cn } from '@/lib/utils';
import { ArrowRight } from '@phosphor-icons/react';

interface MegaMenuProps {
    category: MenuCategory | null;
    isOpen: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function MegaMenu({ category, isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) {
    if (!category || !isOpen) return null;

    return (
        <div
            className={cn(
                "absolute top-full left-0 w-full bg-background border-t border-b shadow-sm z-40 transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="container mx-auto px-6 py-10">
                <div className="flex justify-between">

                    {/* Sol Tərəf: Alt Kateqoriyalar */}
                    <div className="flex-1 grid grid-cols-4 gap-x-12">
                        {category.subcategories.map((sub, index) => {
                            const isEmptyTitle = !sub.title; // Check if title is empty or null
                            return (
                                <div key={index} className="flex flex-col gap-4">
                                    {/* 1. Başlıq yoxdursa (Yeni Gələnlər, Hamısına bax) - Standard Title ölçüsü */}
                                    {isEmptyTitle ? (
                                        <div className="flex flex-col gap-4">
                                            {sub.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block text-sm font-bold uppercase tracking-widest text-foreground hover:opacity-70 transition-opacity"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        /* 2. Standart Kateqoriyalar - Geyim, Ayaqqabı və s. */
                                        <div>
                                            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-1 min-h-[1.25rem]">
                                                {sub.title}
                                            </h3>
                                            <ul className="space-y-3">
                                                {sub.items.map((item) => (
                                                    <li key={item.href} className="group/item flex items-center -ml-2">
                                                        <ArrowRight
                                                            size={14}
                                                            className="mr-1 text-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                                                        />
                                                        <Link
                                                            href={item.href}
                                                            className="block text-[15px] lg:text-base text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Sağ Tərəf: Featured Image (Vizual boşluq doldurmaq üçün) */}
                    <Link
                        href={`${category.href}/new`}
                        className="hidden lg:block w-96 h-80 bg-gray-50 relative overflow-hidden rounded-sm group/image cursor-pointer"
                    >
                        {category.featuredImage ? (
                            <Image
                                src={category.featuredImage}
                                alt={`${category.label} Collection`}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                                sizes="(max-width: 1024px) 100vw, 384px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Vizual Sahə</div>
                        )}

                        {/* "Yeni Gələnlər" Label Bar under image (overlay style matching reference) */}
                        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 py-3 px-4 flex items-center justify-between transition-colors group-hover/image:bg-gray-50">
                            <span className="text-xs font-bold uppercase tracking-widest text-black">
                                {category.label} ÜÇÜN YENİ
                            </span>
                            <ArrowRight size={16} className="text-black" />
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
