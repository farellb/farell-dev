"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-6">


            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-neutral-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-neutral-100 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">


                <div className="mb-12 relative w-80 h-32 md:w-[500px] md:h-48 opacity-90">
                    <Image
                        src="/logo.svg"
                        alt="Farell Brooklyn"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>


                <div className="relative mb-8">
                    <h1 className="text-[120px] md:text-[200px] leading-none font-bold text-black tracking-tighter opacity-5 select-none font-sans">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg md:text-2xl font-serif italic text-neutral-800 tracking-widest bg-white/50 backdrop-blur-sm px-6 py-2 border border-neutral-100">
                            Səhifə Tapılmadı
                        </span>
                    </div>
                </div>


                <p className="text-neutral-500 text-sm md:text-lg max-w-md mb-12 leading-relaxed">
                    Deyəsən stil dünyasında istiqaməti itirmisiniz. Narahat olmayın, hər yolun sonunda yeni bir kəşf var.
                </p>


                <Link
                    href="/"
                    className="group relative px-8 py-4 bg-black text-white text-sm md:text-base uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">Ana Səhifəyə Qayıt</span>
                    <div className="absolute inset-0 bg-neutral-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>

            </div>


            <div className="absolute bottom-8 text-neutral-300 text-xs uppercase tracking-widest">
                Farell Brooklyn © {new Date().getFullYear()}
            </div>

        </div>
    );
}
