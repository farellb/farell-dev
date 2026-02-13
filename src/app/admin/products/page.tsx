"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: number;
    category: { name: string } | null;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select(`
                id, 
                name, 
                price,
                category:categories(name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            alert("Xəta baş verdi");
        } else {
            // @ts-ignore
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Silinmə zamanı xəta.");
        } else {
            fetchProducts();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Məhsullar</h1>
                <Link href="/admin/products/new">
                    <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" size={18} /> Yeni Məhsul
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-900">Ad</th>
                            <th className="px-6 py-4 font-medium text-gray-900">Kateqoriya</th>
                            <th className="px-6 py-4 font-medium text-gray-900">Qiymət</th>
                            <th className="px-6 py-4 font-medium text-gray-900 text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Yüklənir...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Məhsul yoxdur.</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {/* @ts-ignore */}
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{product.price} AZN</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                                                <PencilSimple size={18} />
                                            </button>
                                        </Link>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
