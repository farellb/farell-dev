"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    SquaresFour, Tag, TShirt, SignOut, List, X,
    Gear, TextColumns, WhatsappLogo,
    ArrowSquareOut
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV_SECTIONS = [
    {
        title: "Əsas",
        items: [
            { label: "Dashboard", href: "/admin", icon: SquaresFour },
            { label: "Sorğular", href: "/admin/inquiries", icon: WhatsappLogo },
        ]
    },
    {
        title: "Kataloq",
        items: [
            { label: "Məhsullar", href: "/admin/products", icon: TShirt },
            { label: "Kateqoriyalar", href: "/admin/categories", icon: Tag },
        ]
    },
    {
        title: "Məzmun",
        items: [
            { label: "Səhifələr", href: "/admin/content", icon: TextColumns },
        ]
    },
    {
        title: "Sistem",
        items: [
            { label: "Tənzimləmələr", href: "/admin/settings", icon: Gear },
        ]
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] text-white flex items-center justify-between px-4 z-50 border-b border-white/5">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <List size={20} weight="bold" />
                </button>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Farell" width={20} height={20} className="rounded" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Farell</span>
                </div>
                <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ArrowSquareOut size={18} className="text-white/60" />
                </Link>
            </div>

            {/* Backdrop */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "w-[260px] bg-[#0a0a0a] text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50",
                    "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "scrollbar-thin scrollbar-thumb-white/10"
                )}
            >
                {/* Brand */}
                <div className="px-5 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                            <Image src="/logo.png" alt="Farell" width={32} height={32} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">Farell</h1>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={16} weight="bold" className="text-white/60" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 pb-4 space-y-6">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                                {section.title}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href ||
                                        (item.href !== "/admin" && pathname.startsWith(item.href));

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] group",
                                                isActive
                                                    ? "bg-white text-black font-medium"
                                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <Icon
                                                size={18}
                                                weight={isActive ? "fill" : "regular"}
                                                className={cn(
                                                    "shrink-0 transition-colors",
                                                    isActive ? "text-black" : "text-white/40 group-hover:text-white/70"
                                                )}
                                            />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="px-3 pb-4 space-y-1 mt-auto border-t border-white/5 pt-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all text-[13px] group"
                    >
                        <ArrowSquareOut size={18} className="text-white/30 group-hover:text-white/60 transition-colors" />
                        <span>Saytı aç</span>
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all text-[13px] group">
                        <SignOut size={18} className="text-red-400/40 group-hover:text-red-400/80 transition-colors" />
                        <span>Çıxış</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
