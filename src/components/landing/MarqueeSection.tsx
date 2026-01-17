"use client";

export default function MarqueeSection() {
    return (
        <section className="w-full bg-white py-12 md:py-20 overflow-hidden border-y border-neutral-100 flex select-none">
            <div className="flex animate-scroll whitespace-nowrap">
                <MarqueeContent />
                <MarqueeContent />
                <MarqueeContent />
                <MarqueeContent />
            </div>
            <style jsx>{`
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                }
                @keyframes scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
             `}</style>
        </section>
    )
}

function MarqueeContent() {
    return (
        <div className="flex items-center gap-12 md:gap-24 px-6 md:px-12 flex-shrink-0">
            <span className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase">Farell Brooklyn</span>
            <span className="text-3xl md:text-5xl text-neutral-300">✦</span>
            <span className="text-5xl md:text-8xl font-serif italic tracking-tight text-neutral-500">Müasir Estetika</span>
            <span className="text-3xl md:text-5xl text-neutral-300">✦</span>
            <span className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase">Yeni Kolleksiya</span>
            <span className="text-3xl md:text-5xl text-neutral-300">✦</span>
            <span className="text-5xl md:text-8xl font-serif italic tracking-tight text-neutral-500">Timeless Style</span>
            <span className="text-3xl md:text-5xl text-neutral-300">✦</span>
        </div>
    )
}
