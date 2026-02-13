"use client";

import { useState, useEffect } from "react";
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

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);

    // We will auto-generate variants for simplicity or add a variant manager later
    // For MVP: Default sizes S, M, L, XL
    const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Product
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

            const { data: product, error: productError } = await supabase
                .from('products')
                .insert([{
                    name,
                    slug,
                    price: parseFloat(price),
                    category_id: categoryId,
                    description // Add description column if exists, layout implies it might
                }])
                .select()
                .single();

            if (productError) throw productError;

            const productId = product.id;

            // 2. Insert Images
            if (images.length > 0) {
                const imageInserts = images.map((url, index) => ({
                    product_id: productId,
                    image_url: url,
                    display_order: index
                }));
                const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
                if (imgError) throw imgError;
            }

            // 3. Insert Default Variants (Mock stock)
            const variantInserts = DEFAULT_SIZES.flatMap(size =>
                // Create one variant per size with default color 'Black' or just generic
                [{
                    product_id: productId,
                    size: size,
                    color: 'Black', // Default color
                    stock: 10
                }]
            );
            const { error: varError } = await supabase.from('product_variants').insert(variantInserts);
            if (varError) throw varError;

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(`Məhsul yaradılarkən xəta baş verdi: ${error.message || error.error_description || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Yeni Məhsul</h1>
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

                <div className="pt-4">
                    <Button type="submit" className="w-full bg-black text-white h-12" disabled={loading}>
                        {loading ? "Yaradılır..." : "Məhsulu Yarat"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
