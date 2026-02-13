"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface VisionSectionProps {
    content: Record<string, string>;
}

export default function VisionSection({ content }: VisionSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Progress: 0 when section top enters viewport bottom, 1 when section top reaches viewport top
            const p = 1 - (rect.top / windowHeight);
            setProgress(Math.max(0, Math.min(1, p)));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Subtle parallax: images shift slightly as you scroll
    const leftY = (1 - progress) * -15;
    const rightY = (1 - progress) * 15;
    const centerScale = 0.95 + (progress * 0.05);
    const centerOpacity = 0.8 + (progress * 0.2);

    const leftTitle = content?.['left_title'] || 'Tekstura';
    const centerTitle = content?.['center_title'] || 'Vizyon';
    const rightTitle = content?.['right_title'] || 'Struktur';
    const leftImage = content?.['left_image'] || '/texture.png';
    const centerImage = content?.['center_image'] || '/vision-model.png';
    const rightImage = content?.['right_image'] || '/structure.png';

    return (
        <section ref={sectionRef} className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row">

            {/* Left Column */}
            <div
                className="w-full md:w-1/3 h-full relative border-r border-white/10 transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `translateY(${leftY}%)` }}
            >
                <Image src={leftImage} alt="Texture" fill className="object-cover opacity-80" loading="lazy" quality={70} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-10 md:-rotate-90 md:origin-bottom-left">
                    <h3 className="text-4xl font-bold text-white tracking-widest uppercase drop-shadow-lg" style={{ opacity: progress > 0.3 ? 1 : 0, transition: 'opacity 0.5s' }}>
                        {leftTitle}
                    </h3>
                </div>
            </div>

            {/* Center Column */}
            <div
                className="w-full md:w-1/3 h-full relative border-r border-white/10 z-10 flex items-center justify-center transition-all duration-300 ease-out will-change-transform"
                style={{
                    transform: `scale(${centerScale})`,
                    opacity: centerOpacity
                }}
            >
                <Image src={centerImage} alt="Form" fill className="object-cover" loading="lazy" quality={75} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                    <h2 className="text-[12vw] md:text-[8vw] font-black text-white uppercase leading-none text-center drop-shadow-2xl"
                        style={{ letterSpacing: `${Math.max(0, 10 - progress * 10)}px` }}
                    >
                        {centerTitle}
                    </h2>
                </div>
            </div>

            {/* Right Column */}
            <div
                className="w-full md:w-1/3 h-full relative transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `translateY(${rightY}%)` }}
            >
                <Image src={rightImage} alt="Architecture" fill className="object-cover opacity-80" loading="lazy" quality={70} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 right-10 md:rotate-90 md:origin-bottom-right">
                    <h3 className="text-4xl font-bold text-white tracking-widest uppercase drop-shadow-lg" style={{ opacity: progress > 0.3 ? 1 : 0, transition: 'opacity 0.5s' }}>
                        {rightTitle}
                    </h3>
                </div>
            </div>

        </section>
    );
}
