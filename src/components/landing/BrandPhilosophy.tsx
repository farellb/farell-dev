'use client';

import Image from 'next/image';

export function BrandPhilosophy() {
    return (
        <section className="relative w-full py-32 lg:py-48 bg-white overflow-hidden text-black">

            {/* Kağız Arxa Fon Teksturası */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
                <svg width="100%" height="100%">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.1" />
                </svg>
            </div>

            {/* Vektor (Yuxarı Sağ) */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 100 C 40 10, 150 10, 190 100 C 210 150, 100 190, 50 150 C 10 120, 150 50, 180 20" stroke="black" strokeWidth="1" />
                </svg>
            </div>

            {/* Vektor (Aşağı Sol) */}
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] opacity-[0.03] pointer-events-none rotate-12">
                <svg viewBox="0 0 200 200" fill="none" stroke="black" strokeWidth="0.5">
                    <rect x="50" y="50" width="100" height="100" />
                    <circle cx="100" cy="100" r="40" />
                    <line x1="50" y1="50" x2="150" y2="150" />
                </svg>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* İllustrasiya Sütunu - Sol/Mərkəz */}
                    <div className="w-full lg:w-1/2 relative flex justify-center">
                        {/* Çərçivə */}
                        <div className="absolute top-4 left-4 w-full h-full border border-black/10 -z-10 translate-x-4 translate-y-4" />

                        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[550px] bg-white shadow-2xl skew-y-2 transform transition-transform duration-700 hover:skew-y-0">
                            <Image
                                src="/fashion-illustration.png"
                                alt="Farell Brooklyn Sketch"
                                fill
                                className="object-cover p-4 bg-white"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            {/* Lent Effekti */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-100/50 backdrop-blur-sm -rotate-2 shadow-sm" />
                        </div>
                    </div>

                    {/* Məzmun Sütunu - Sağ */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                        <span className="font-serif italic text-2xl text-neutral-400 mb-4">
                            vizual qeydlər, cild 01.
                        </span>

                        <h2 className="text-6xl md:text-8xl font-normal uppercase tracking-tighter leading-[0.85] mb-8 relative">
                            Mükəmməl <br />
                            <span className="relative inline-block">
                                Sadəlik
                                {/* Alt Xətt Vektoru */}
                                <svg className="absolute -bottom-2 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="black" strokeWidth="2" />
                                </svg>
                            </span> <br />
                            Detallarda.
                        </h2>

                        <div className="flex gap-4 mb-8">
                            <div className="w-2 h-2 rounded-full bg-black" />
                            <div className="w-2 h-2 rounded-full bg-neutral-300" />
                            <div className="w-2 h-2 rounded-full bg-neutral-100 border border-black" />
                        </div>

                        <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-md">
                            Sadəlik – ən yüksək incəlikdir. Biz keçici trendləri deyil,
                            zamansız dəyərləri seçirik. Sizin üçün hazırladığımız hər parça,
                            funksionallıq və estetikanın mükəmməl balansıdır.
                        </p>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                <div className="w-10 h-10 rounded-full border border-black bg-white flex items-center justify-center text-xs font-serif italic">A</div>
                                <div className="w-10 h-10 rounded-full border border-black bg-neutral-100 flex items-center justify-center text-xs font-serif italic">B</div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
                                Fəlsəfəni Kəşf Et
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
