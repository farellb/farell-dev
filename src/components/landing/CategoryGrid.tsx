'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    label: string;
    href: string;
    image: string;
    alt: string;
}

export function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTopLevelCategories() {
            setLoading(true);
            try {
                // Fetch top-level categories (parent_id is null)
                const { data, error } = await supabase
                    .from('categories')
                    .select('id, name, slug, image_url')
                    .is('parent_id', null)
                    .order('created_at', { ascending: true }); // Or order by some display_order if we add it

                if (data) {
                    const formatted = data.map(cat => ({
                        id: cat.id,
                        label: cat.name,
                        href: `/shop?category=${cat.slug}`,
                        image: cat.image_url || '/placeholder.png', // Fallback image needed?
                        alt: `Farell Brooklyn ${cat.name}`,
                    }));
                    setCategories(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTopLevelCategories();
    }, []);

    if (loading) {
        return <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">Yüklənir...</div>;
    }

    if (categories.length === 0) {
        return (
            <div className="w-full h-96 bg-black flex items-center justify-center text-gray-500">
                Kateqoriya tapılmadı. Admin paneldən əlavə edin.
            </div>
        );
    }

    return (
        <section className="w-full min-h-screen bg-black">
            <div className={`w-full h-full grid ${categories.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={category.href}
                        className={`relative w-full h-[50vh] group overflow-hidden
                            ${index % 2 === 0 ? 'border-r border-white/10' : ''}
                            ${index < 2 ? 'border-b border-white/10' : ''}
                        `}
                    >

                        <div className="absolute inset-0 z-0 bg-gray-900">
                            {category.image && category.image !== '/placeholder.png' ? (
                                <Image
                                    src={category.image}
                                    alt={category.alt}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={80}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                            )}

                            <div className="absolute inset-0 bg-black/10 md:bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                        </div>


                        <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">


                            <div className="self-end opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 text-white">
                                <ArrowUpRight size={32} weight="light" />
                            </div>


                            <div className="transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h2 className="text-4xl lg:text-5xl font-normal uppercase tracking-tighter text-white">
                                    {category.label}
                                </h2>
                                <div className="hidden md:block h-px w-0 group-hover:w-full bg-white mt-4 transition-all duration-700 ease-in-out" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
