"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);

    // We will assume variants are standard for now (XS-XL) and just manage the product details
    // Complex variant management can be added later

    useEffect(() => {
        const fetchData = async () => {
            // 1. Fetch Categories
            const { data: cats } = await supabase.from('categories').select('id, name');
            if (cats) setCategories(cats);

            // 2. Fetch Product
            const { data: product, error } = await supabase
                .from('products')
                .select(`
                    *,
                    images:product_images(image_url, display_order)
                `)
                .eq('id', id)
                .single();

            if (error || !product) {
                console.error(error);
                alert("Məhsul tapılmadı");
                router.push('/admin/products');
                return;
            }

            setName(product.name);
            setPrice(product.price.toString());
            setCategoryId(product.category_id || "");
            setDescription(product.description || "");

            // Sort images by display_order
            const sortedImages = (product.images || [])
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((img: any) => img.image_url);

            setImages(sortedImages);
            setLoading(false);
        };

        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // 1. Update Product
            const { error: productError } = await supabase
                .from('products')
                .update({
                    name,
                    price: parseFloat(price),
                    category_id: categoryId,
                    description
                })
                .eq('id', id);

            if (productError) throw productError;

            // 2. Update Images (Strategy: Delete all and Re-insert for simplicity)
            // Ideally we should diff, but this is an MVP Admin Panel.

            await supabase.from('product_images').delete().eq('product_id', id);

            if (images.length > 0) {
                const imageInserts = images.map((url, index) => ({
                    product_id: id,
                    image_url: url,
                    display_order: index
                }));
                const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
                if (imgError) throw imgError;
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Yadda saxlanılarkən xəta baş verdi.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Yüklənir...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Məhsulu Redaktə Et</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-gray-200">
                <div className="space-y-2">
                    <Label>Şəkillər</Label>
                    <ImageUpload
                        value={images}
                        onChange={setImages}
                        onRemove={(url) => setImages(images.filter(img => img !== url))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Məhsulun Adı</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Məs: Qara T-Shirt"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Qiymət (AZN)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Kateqoriya</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Seçin...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Təsvir</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Məhsul haqqında..."
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 h-12">
                        Ləğv et
                    </Button>
                    <Button type="submit" className="flex-1 bg-black text-white h-12" disabled={saving}>
                        {saving ? "Yadda saxlanılır..." : "Yadda Saxla"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
