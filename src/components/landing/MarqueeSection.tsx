"use client";

interface MarqueeSectionProps {
    content: Record<string, string>;
}

export default function MarqueeSection({ content }: MarqueeSectionProps) {
    let items: string[] = ["Farell Brooklyn", "Müasir Estetika", "Yeni Kolleksiya", "Timeless Style"];

    if (content?.['items']) {
        try {
            items = JSON.parse(content['items']);
        } catch (e) {
            console.error("Failed to parse marquee items", e);
        }
    }

    return (
        <section className="w-full bg-white py-12 md:py-20 overflow-hidden border-y border-neutral-100 flex select-none">
            <div className="flex animate-scroll whitespace-nowrap">
                <MarqueeContent items={items} />
                <MarqueeContent items={items} />
                <MarqueeContent items={items} />
                <MarqueeContent items={items} />
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

function MarqueeContent({ items }: { items: string[] }) {
    return (
        <div className="flex items-center gap-12 md:gap-24 px-6 md:px-12 flex-shrink-0">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-12 md:gap-24">
                    <span className={idx % 2 === 0
                        ? "text-5xl md:text-8xl font-black tracking-tighter text-black uppercase"
                        : "text-5xl md:text-8xl font-serif italic tracking-tight text-neutral-500"
                    }>
                        {item}
                    </span>
                    <span className="text-3xl md:text-5xl text-neutral-300">✦</span>
                </div>
            ))}
        </div>
    )
}
