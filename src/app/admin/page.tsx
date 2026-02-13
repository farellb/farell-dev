"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
    TShirt, Tag, WhatsappLogo,
    ArrowRight, Plus, CaretRight, Clock,
    Package, Storefront, FolderSimple
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    rootCategories: number;
    recentProducts: any[];
    topCategories: any[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCategories: 0,
        rootCategories: 0,
        recentProducts: [],
        topCategories: [],
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const [productsRes, categoriesRes, rootCatsRes, recentRes, topCatsRes] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('categories').select('*', { count: 'exact', head: true }),
                supabase.from('categories').select('*', { count: 'exact', head: true }).is('parent_id', null),
                supabase.from('products').select('id, name, price, images, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('categories').select('id, name, slug, image_url').is('parent_id', null).limit(4),
            ]);

            setStats({
                totalProducts: productsRes.count || 0,
                totalCategories: categoriesRes.count || 0,
                rootCategories: rootCatsRes.count || 0,
                recentProducts: recentRes.data || [],
                topCategories: topCatsRes.data || [],
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    const greeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Sabahınız xeyir";
        if (hour < 18) return "Günortanız xeyir";
        return "Axşamınız xeyir";
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('az-AZ', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const statCards = [
        {
            label: "Məhsullar",
            value: stats.totalProducts,
            icon: TShirt,
            href: "/admin/products",
            iconColor: "text-gray-700",
            iconBg: "bg-gray-100",
            description: "Ümumi məhsul sayı"
        },
        {
            label: "Kateqoriyalar",
            value: stats.totalCategories,
            icon: Tag,
            href: "/admin/categories",
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50",
            description: `${stats.rootCategories} ana kateqoriya`
        },
        {
            label: "Sorğular",
            value: 0,
            icon: WhatsappLogo,
            href: "/admin/inquiries",
            iconColor: "text-green-600",
            iconBg: "bg-green-50",
            description: "WhatsApp sorğuları"
        },
        {
            label: "Ana Kateqoriya",
            value: stats.rootCategories,
            icon: FolderSimple,
            href: "/admin/categories",
            iconColor: "text-violet-600",
            iconBg: "bg-violet-50",
            description: "Menyu strukturu"
        },
    ];

    const quickActions = [
        { label: "Yeni Məhsul", href: "/admin/products/new", icon: Plus, description: "Məhsul əlavə et" },
        { label: "Kateqoriyalar", href: "/admin/categories", icon: Tag, description: "Strukturu idarə et" },
        { label: "Məzmun", href: "/admin/content", icon: Storefront, description: "Sayt məzmunu" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Yüklənir...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-400 font-medium">{formatDate()}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{greeting()}</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 shrink-0"
                >
                    <Plus size={16} weight="bold" />
                    Yeni Məhsul
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 hover:shadow-black/5"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-400 text-[11px] sm:text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5">{stat.value}</p>
                                    <p className="text-gray-400 text-[11px] sm:text-xs mt-1">{stat.description}</p>
                                </div>
                                <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center", stat.iconBg)}>
                                    <Icon size={20} weight="fill" className={stat.iconColor} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Sürətli Əməliyyatlar</h2>
                    </div>
                    <div className="p-3 space-y-1">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <Icon size={18} weight="bold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{action.label}</p>
                                        <p className="text-xs text-gray-400">{action.description}</p>
                                    </div>
                                    <CaretRight size={14} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Products */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Son Məhsullar</h2>
                        <Link href="/admin/products" className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                            Hamısı <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Package size={40} className="text-gray-200 mb-3" />
                                <p className="font-medium text-gray-500 text-sm">Hələ məhsul yoxdur</p>
                                <p className="text-xs text-gray-400 mt-1">İlk məhsulunuzu əlavə edin</p>
                                <Link
                                    href="/admin/products/new"
                                    className="mt-4 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                                >
                                    <Plus size={14} weight="bold" />
                                    Məhsul Əlavə Et
                                </Link>
                            </div>
                        ) : (
                            stats.recentProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors group"
                                >
                                    <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={48}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <TShirt size={20} className="text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-semibold text-gray-700">{product.price} ₼</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(product.created_at).toLocaleDateString('az-AZ')}
                                            </span>
                                        </div>
                                    </div>
                                    <CaretRight size={14} className="text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Categories Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Ana Kateqoriyalar</h2>
                    <Link href="/admin/categories" className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                        İdarə et <ArrowRight size={12} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
                    {stats.topCategories.map((cat) => (
                        <Link
                            key={cat.id}
                            href="/admin/categories"
                            className="bg-white p-5 sm:p-6 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors group text-center"
                        >
                            {cat.image_url ? (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                    <Image src={cat.image_url} alt={cat.name} width={64} height={64} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                                    <Tag size={22} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer note */}
            <div className="text-center pb-4">
                <p className="text-[11px] text-gray-300 uppercase tracking-widest">
                    Farell Brooklyn — Admin Panel v1.0
                </p>
            </div>
        </div>
    );
}
