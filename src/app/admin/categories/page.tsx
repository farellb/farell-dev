"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";

interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    image_url: string | null;
    parent?: { name: string };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentId, setParentId] = useState<string>("null"); // "null" string to handle select value
    const [imageUrl, setImageUrl] = useState<string>("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isDialogOpen) {
            resetForm();
        }
    }, [isDialogOpen]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select(`
                *,
                parent:categories!parent_id(name)
            `)
            .order('name');

        if (error) {
            console.error(error);
            alert("Xəta baş verdi");
        } else {
            // @ts-ignore
            setCategories(data || []);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setSlug("");
        setParentId("null");
        setImageUrl("");
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setName(cat.name);
        setSlug(cat.slug);
        setParentId(cat.parent_id || "null");
        setImageUrl(cat.image_url || "");
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                name,
                slug,
                parent_id: parentId === "null" ? null : parentId,
                image_url: imageUrl || null
            };

            if (editingId) {
                const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([payload]);
                if (error) throw error;
            }

            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            alert(`Xəta: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bunu silmək istədiyinizə əminsiniz? Alt kateqoriyalar varsa silinməyə bilər.")) return;

        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            console.error(error);
            alert("Silinmə zamanı xəta. Ola bilsin bu kateqoriyanın alt kateqoriyaları və ya məhsulları var.");
        } else {
            fetchCategories();
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!editingId) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    // Filter potential parents: exclude self if editing
    const parentOptions = categories.filter(c => c.id !== editingId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Kateqoriyalar</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Plus className="mr-2" size={18} /> Yeni Kateqoriya
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Kateqoriyanı Düzəlt" : "Yeni Kateqoriya"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Şəkil (Ana kateqoriyalar üçün vacibdir)</Label>
                                <ImageUpload
                                    value={imageUrl ? [imageUrl] : []}
                                    onChange={(urls) => setImageUrl(urls[0] || "")}
                                    onRemove={() => setImageUrl("")}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Ad</Label>
                                    <Input
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Məs: Kişi"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Slug</Label>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="kisi"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Ana Kateqoriya</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                >
                                    <option value="null">-- Yoxdur (Ana Kateqoriya) --</option>
                                    {parentOptions.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Button type="submit" className="w-full bg-black text-white" disabled={saving}>
                                {saving ? "Saxlanılır..." : "Yadda Saxla"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-900">Şəkil</th>
                            <th className="px-6 py-4 font-medium text-gray-900">Ad</th>
                            <th className="px-6 py-4 font-medium text-gray-900">Ana Kateqoriya</th>
                            <th className="px-6 py-4 font-medium text-gray-900">Slug</th>
                            <th className="px-6 py-4 font-medium text-gray-900 text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Yüklənir...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Kateqoriya yoxdur.</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {cat.image_url ? (
                                            <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-cover rounded" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {/* @ts-ignore */}
                                        {cat.parent?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                                            <PencilSimple size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
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
