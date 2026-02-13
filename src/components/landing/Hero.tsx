import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowDown } from '@phosphor-icons/react/dist/ssr'; // Ensure SSR compatible
import { getContentBlocks } from '@/lib/content';

export async function Hero() {
    const content = await getContentBlocks('hero');

    const titleLine1 = content['title_line_1'] || 'Detalları';
    const titleLine2 = content['title_line_2'] || 'Gör';
    const titleLine3 = content['title_line_3'] || 'Fərqi Hiss Et';
    const subtitle = content['subtitle'] || 'Zamanın fövqündə duran stil. Sadəlik və mükəmməllik.';
    const imageUrl = content['image_url'] || '/hero-male.png';
    const ctaText = content['cta_text'] || 'Kolleksiyanı Kəşf Et'; // Not used in current design but good to have
    const ctaLink = content['cta_link'] || '/shop'; // Not used in current design but good to have

    return (
        <>

            <section className="md:hidden relative w-full h-[calc(100vh-4rem)] overflow-hidden">
                <Image
                    src={imageUrl}
                    alt="Farell Brooklyn Collection"
                    fill
                    className="object-cover object-top"
                    priority
                    quality={90}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


                <div className="absolute right-4 bottom-32 z-10 text-right">
                    <h1 className="text-3xl font-normal uppercase tracking-tighter text-white leading-[0.9] mb-3">
                        {titleLine1} <br />
                        <span className="text-white/60">{titleLine2}</span>, <br />
                        {titleLine3}
                    </h1>
                    <p className="text-sm text-white/70 max-w-xs leading-relaxed font-light ml-auto">
                        {subtitle}
                    </p>
                </div>


                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <ArrowDown size={20} className="text-white opacity-70" />
                </div>
            </section>


            <section className="hidden md:flex relative w-full h-[calc(100vh-6rem)] flex-row overflow-hidden bg-white">

                {/* Sol Tərəf: Məzmun */}<div className="w-1/2 h-full flex flex-col justify-center px-20 lg:px-24 xl:px-32 bg-white relative z-10">

                    {/* Arxa Fon Xətləri - Yuxarı və Aşağı */}<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.04]">
                        <svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="none">

                            <path
                                d="M -100 200 C 150 50 350 300 650 100 S 950 -100 1050 100"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            />
                            <path
                                d="M -100 100 C 200 -50 400 200 700 50 S 1000 -150 1100 50"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            />

                            <path
                                d="M -100 600 C 200 400 300 800 600 500 S 900 200 1000 400"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            />
                            <path
                                d="M -100 700 C 150 500 350 900 650 600 S 950 300 1050 500"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>

                    {/* İynə və İp Vektoru */}<div className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.04]">
                        <svg width="500" height="600" viewBox="0 0 100 120" fill="none" stroke="black" strokeWidth="0.6">

                            <path d="M50 5 L50 95" strokeLinecap="round" />
                            <ellipse cx="50" cy="10" rx="3" ry="5" />

                            <ellipse cx="50" cy="10" rx="1" ry="2" />

                            <path d="M49 95 L50 100 L51 95" fill="black" />


                            <path
                                d="M50 10 C 30 25 70 40 40 55 C 10 70 80 85 50 100 C 20 115 90 120 60 130"
                                strokeWidth="0.4"
                                strokeDasharray="3 2"
                            />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-start gap-6 lg:gap-8 animate-in fade-in slide-in-from-left-10 duration-1000">

                        {/* Əsas Başlıq */}<h1 className="text-6xl lg:text-7xl xl:text-8xl font-normal uppercase tracking-tighter text-black leading-[0.9]">
                            {titleLine1} <br />
                            <span className="text-neutral-400">{titleLine2}</span>, <br />
                            {titleLine3}
                        </h1>

                        {/* Açıqlama */}<p className="text-sm lg:text-base text-neutral-500 max-w-sm leading-relaxed font-light mt-4 tracking-wide">
                            {subtitle}
                        </p>

                    </div>
                </div>

                {/* Sağ Tərəf: Şəkil */}<div className="w-1/2 h-full relative bg-neutral-100">
                    <Image
                        src={imageUrl}
                        alt="Farell Brooklyn Collection"
                        fill
                        className="object-cover object-top"
                        priority
                        quality={90}
                    />


                    <div className="absolute top-6 right-6 z-20 animate-spin-slow">

                        <svg viewBox="0 0 100 100" width="120" height="120">
                            <defs>
                                <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                            </defs>
                            <text fontSize="11" fontWeight="bold" letterSpacing="2">
                                <textPath xlinkHref="#circle" className="uppercase fill-black">
                                    Premium Collection • Farell Brooklyn •
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>


                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce flex flex-col items-center gap-2">
                    <ArrowDown size={24} className="text-black opacity-80" />
                </div>

            </section>
        </>
    );
}
