"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function VisionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { top, height } = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start animation when section hits top of viewport
            // End when it's fully scrolled
            const scrollDistance = height - windowHeight;
            const scrolled = -top;

            let p = scrolled / scrollDistance;
            p = Math.max(0, Math.min(1, p)); // Clamp 0-1

            setProgress(p);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animation calculations
    // 0 -> 1: Panels slide into place
    const leftY = (1 - progress) * -100; // Starts up 100%, moves to 0
    const rightY = (1 - progress) * 100; // Starts down 100%, moves to 0
    const centerScale = 0.8 + (progress * 0.2); // 0.8 -> 1.0
    const centerOpacity = 0.5 + (progress * 0.5); // 0.5 -> 1.0

    const textSpacing = 20 - (progress * 20); // 20px -> 0px (Letter spacing tracking-widest -> normal-ish)

    return (
        <section ref={containerRef} className="relative w-full h-[250vh] bg-black">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row pt-20 lg:pt-24">

                {/* Left Panel - Fabric/Texture */}
                <div
                    className="w-full md:w-1/3 h-full relative border-r border-white/10 transition-transform duration-75 ease-linear will-change-transform"
                    style={{ transform: `translateY(${leftY}%)` }}
                >
                    <Image src="/texture.png" alt="Texture" fill className="object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-10 left-10 md:-rotate-90 md:origin-bottom-left">
                        <h3 className="text-4xl font-bold text-white tracking-widest uppercase opacity-0 animate-fadeIn drop-shadow-lg" style={{ animationDelay: '0.2s', opacity: progress > 0.5 ? 1 : 0, transition: 'opacity 0.5s' }}>
                            Tekstura
                        </h3>
                    </div>
                </div>

                {/* Center Panel - Form/Model */}
                <div
                    className="w-full md:w-1/3 h-full relative border-r border-white/10 z-10 flex items-center justify-center"
                    style={{
                        transform: `scale(${centerScale})`,
                        opacity: centerOpacity
                    }}
                >
                    <Image src="/vision-model.png" alt="Form" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                        <h2 className="text-[12vw] md:text-[8vw] font-black text-white uppercase leading-none text-center drop-shadow-2xl"
                            style={{ letterSpacing: `${Math.max(0, 10 - progress * 10)}px` }}
                        >
                            Vizyon
                        </h2>
                    </div>
                </div>

                {/* Right Panel - Structure/Arch */}
                <div
                    className="w-full md:w-1/3 h-full relative transition-transform duration-75 ease-linear will-change-transform"
                    style={{ transform: `translateY(${rightY}%)` }}
                >
                    <Image src="/structure.png" alt="Architecture" fill className="object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-10 right-10 md:rotate-90 md:origin-bottom-right">
                        <h3 className="text-4xl font-bold text-white tracking-widest uppercase opacity-0 drop-shadow-lg" style={{ opacity: progress > 0.5 ? 1 : 0, transition: 'opacity 0.5s' }}>
                            Struktur
                        </h3>
                    </div>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-[0.5em] transition-opacity duration-500 whitespace-nowrap ${progress > 0.9 ? 'opacity-0' : 'opacity-100'}`}>
                BİRLƏŞDİRMƏK ÜÇÜN SÜRÜŞDÜR
            </div>
        </section>
    );
}
