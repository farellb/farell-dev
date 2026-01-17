'use client';

import Image from 'next/image';
import Link from 'next/link';

export function StoreSection() {
    return (
        <section className="relative w-full h-[80vh] bg-neutral-900 overflow-hidden">


            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                <Image
                    src="/photobg-w.png"
                    alt="Farell Brooklyn Store"
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={60}
                    sizes="100vw"
                />

                <div className="absolute inset-0 bg-black/20" />
            </div>


            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none px-2 lg:px-6">
                <h2 className="w-full text-center text-[9vw] md:text-[11vw] font-bold text-[#D4D4D4] tracking-widest whitespace-nowrap select-none opacity-90 uppercase scale-y-110">
                    Farell Brooklyn
                </h2>
            </div>


            <div className="absolute bottom-12 left-8 md:left-16 z-20 flex flex-col items-start gap-6">

                {/* Alt Yazı */}<p className="text-2xl md:text-3xl font-light text-white/80 max-w-md drop-shadow-md">
                    Müasir estetika və keyfiyyət.
                </p>

                {/* CTA Pill Button (Solid Grey) */}<Link
                    href="/stores"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#BDBDBD] rounded-full text-black text-xs md:text-sm font-bold tracking-wide hover:bg-white transition-all duration-300 min-w-[180px]"
                >
                    Mağazalarımızı kəşf edin
                </Link>

            </div>

        </section>
    );
}
