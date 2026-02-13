"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plus, Trash, PencilSimple, MagnifyingGlass, X,
    TShirt, CaretRight, Funnel, Eye, Package
} from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    is_active: boolean;
    created_at: string;
    category: { name: string } | null;
    images: { image_url: string; display_order: number }[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select(`
                id, name, slug, price, is_active, created_at,
                category:categories(name),
                images:product_images(image_url, display_order)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            // @ts-ignore
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Silinmə zamanı xəta.");
        } else {
            setDeleteConfirm(null);
            fetchProducts();
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getProductImage = (product: Product) => {
        if (!product.images || product.images.length === 0) return null;
        const sorted = [...product.images].sort((a, b) => a.display_order - b.display_order);
        return sorted[0]?.image_url;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Məhsullar</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {loading ? "Yüklənir..." : `${products.length} məhsul`}
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                    <Plus size={16} weight="bold" />
                    Yeni Məhsul
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Məhsul axtar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                        <p className="text-sm text-gray-400 font-medium">Yüklənir...</p>
                    </div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <Package size={32} className="text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-500 text-sm">
                            {searchQuery ? "Heç bir nəticə tapılmadı" : "Hələ məhsul yoxdur"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {searchQuery ? "Axtarış sorğunuzu dəyişdirin" : "İlk məhsulunuzu əlavə edin"}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/admin/products/new"
                                className="mt-4 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={14} weight="bold" />
                                Məhsul Əlavə Et
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Məhsul</th>
                                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kateqoriya</th>
                                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Qiymət</th>
                                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Əməliyyat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => {
                                    const img = getProductImage(product);
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-5 py-3">
                                                <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                                                    <div className="w-11 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                        {img ? (
                                                            <Image src={img} alt={product.name} width={44} height={56} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <TShirt size={18} className="text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-black">{product.name}</p>
                                                        <p className="text-xs text-gray-400 font-mono truncate">{product.slug}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-sm text-gray-500">
                                                    {/* @ts-ignore */}
                                                    {product.category?.name || '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-sm font-semibold text-gray-900">{product.price} ₼</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium",
                                                    product.is_active !== false
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {product.is_active !== false ? "Aktiv" : "Deaktiv"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <PencilSimple size={16} />
                                                    </Link>
                                                    {deleteConfirm === product.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="px-2 py-1 bg-red-500 text-white rounded-lg text-[11px] font-medium hover:bg-red-600 transition-colors"
                                                            >
                                                                Sil
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-medium hover:bg-gray-200 transition-colors"
                                                            >
                                                                Xeyr
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(product.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-2">
                        {filteredProducts.map((product) => {
                            const img = getProductImage(product);
                            return (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 p-3">
                                        <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                            {img ? (
                                                <Image src={img} alt={product.name} width={64} height={80} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <TShirt size={22} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {/* @ts-ignore */}
                                                {product.category?.name || '—'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-sm font-semibold text-gray-900">{product.price} ₼</span>
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                                                    product.is_active !== false
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {product.is_active !== false ? "Aktiv" : "Deaktiv"}
                                                </span>
                                            </div>
                                        </div>
                                        <CaretRight size={16} className="text-gray-300 shrink-0" />
                                    </Link>
                                    {/* Mobile Actions */}
                                    <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                                        >
                                            <PencilSimple size={14} />
                                            Redaktə
                                        </Link>
                                        {deleteConfirm === product.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-red-500 bg-red-50 font-medium"
                                                >
                                                    Bəli, Sil
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:bg-gray-50"
                                                >
                                                    Ləğv et
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(product.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash size={14} />
                                                Sil
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
