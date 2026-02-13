"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Tag, TShirt, SignOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: SquaresFour },
    { label: "Məhsullar", href: "/admin/products", icon: TShirt },
    { label: "Kateqoriyalar", href: "/admin/categories", icon: Tag },
    { label: "Məzmun", href: "/admin/content", icon: SquaresFour }, // Changed icon to SquaresFour or similar if needed, reused SquaresFour for dashboard, maybe use 'Article' or 'Pencil' if available. Using SquaresFour for now as dashboard. Let's use 'Penck' or 'FileText' if available, otherwise just use TextT
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-black text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold uppercase tracking-widest">Farell Admin</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-white text-black"
                                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                            )}
                        >
                            <Icon size={20} weight={isActive ? "fill" : "regular"} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-900 rounded-lg transition-colors text-sm font-medium">
                    <SignOut size={20} />
                    Çıxış
                </button>
            </div>
        </aside>
    );
}
