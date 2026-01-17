"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-neutral-200 relative overflow-hidden">
            {/* Dekorativ Əyri Xətt */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1400 400"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="20%" stopColor="#d4d4d4" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#a3a3a3" stopOpacity="0.8" />
                        <stop offset="80%" stopColor="#d4d4d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Dalğa 1 - Əsas Axın (Mobildə Görünən) */}
                <path
                    d="M-50 220 C 300 220, 500 290, 750 250 C 950 220, 1100 -50, 1250 -10 C 1350 20, 1400 170, 1500 220"
                    stroke="url(#waveGradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-60"
                />

                {/* Dalğa 4 - Orta Sıx Doldurucu (Mobildə Gizli) */}
                <path
                    d="M-50 205 C 200 205, 450 270, 700 230 C 900 200, 1050 -10, 1200 30 C 1300 60, 1350 210, 1450 260"
                    stroke="url(#waveGradient)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="opacity-50 hidden md:block"
                />

                {/* Dalğa 2 - Əks-səda (Mobildə Gizli) */}
                <path
                    d="M-50 240 C 300 240, 520 310, 770 270 C 970 240, 1120 -30, 1270 10 C 1370 40, 1420 190, 1520 240"
                    stroke="url(#waveGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    className="opacity-40 hidden md:block"
                />

                {/* Dalğa 3 - Zərif Dalğalanma (Mobildə Görünən) */}
                <path
                    d="M-50 260 C 300 260, 540 330, 790 290 C 990 260, 1140 -10, 1290 30 C 1390 60, 1440 210, 1540 260"
                    stroke="url(#waveGradient)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    className="opacity-30"
                />
            </svg>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
                {/* Əsas Footer Şəbəkəsi - Mobildə 2 sütun, Desktopda 4 sütun */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">

                    {/* MAĞAZA Sütunu */}
                    <div>
                        <h4 className="text-sm md:text-base font-semibold text-black uppercase tracking-wider mb-5 md:mb-6">
                            Mağaza
                        </h4>
                        <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-neutral-500">
                            <li><Link href="/women" className="hover:text-black transition-colors">Qadın</Link></li>
                            <li><Link href="/men" className="hover:text-black transition-colors">Kişi</Link></li>
                            <li><Link href="/kids" className="hover:text-black transition-colors">Uşaq</Link></li>
                            <li><Link href="/accessories" className="hover:text-black transition-colors">Aksesuar</Link></li>
                        </ul>
                    </div>

                    {/* HAQQIMIZDA Sütunu */}
                    <div>
                        <h4 className="text-sm md:text-base font-semibold text-black uppercase tracking-wider mb-5 md:mb-6">
                            Haqqımızda
                        </h4>
                        <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-neutral-500">
                            <li><Link href="/about" className="hover:text-black transition-colors">Biz Kimik</Link></li>
                            <li><Link href="/stores" className="hover:text-black transition-colors">Mağazalar</Link></li>
                        </ul>
                    </div>

                    {/* DƏSTƏK Sütunu */}
                    <div>
                        <h4 className="text-sm md:text-base font-semibold text-black uppercase tracking-wider mb-5 md:mb-6">
                            Dəstək
                        </h4>
                        <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-neutral-500">
                            <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Əlaqə</Link></li>
                        </ul>
                    </div>

                    {/* SUALINIZ VAR? Sütunu */}
                    <div>
                        <h4 className="text-sm md:text-base font-semibold text-black uppercase tracking-wider mb-5 md:mb-6">
                            Sualınız var?
                        </h4>
                        <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-neutral-500">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +994 12 123 45 67
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@farellbrooklyn.az
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sosial İkonlar Bölməsi */}
                <div className="mt-10 md:mt-14 pt-8 border-transparent">
                    <h4 className="text-xs md:text-sm font-semibold text-black uppercase tracking-wider mb-5">
                        Bizi İzləyin
                    </h4>
                    <div className="flex items-center gap-5">
                        {/* Instagram */}
                        <a href="https://instagram.com/farell_brooklyn" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black transition-colors">
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="https://www.facebook.com/profile.php?id=61576963405241" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black transition-colors">
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Alt Panel */}
                <div className="mt-10 md:mt-14 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" alt="Farell Brooklyn" width={28} height={28} className="opacity-70" />
                        <span className="text-sm md:text-base font-medium text-neutral-500">FARELL BROOKLYN</span>
                    </div>

                    {/* Müəllif Hüquqları və Qanuni */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-neutral-400">
                        <span>© {currentYear} Farell Brooklyn</span>
                        <Link href="/privacy" className="hover:text-black transition-colors">Məxfilik Siyasəti</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">İstifadə Şərtləri</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
