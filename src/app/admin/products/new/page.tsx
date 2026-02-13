"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, FloppyDisk, CaretRight, Check,
    TShirt, Tag, Percent, Palette, Ruler, Plus, X
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────
interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    slug?: string;
}

// ─── Presets ───────────────────────────────────────────
const COLOR_PRESETS = [
    { name: "Qara", value: "#000000" },
    { name: "Ağ", value: "#FFFFFF" },
    { name: "Boz", value: "#808080" },
    { name: "Göy", value: "#1e3a5f" },
    { name: "Qırmızı", value: "#c41e3a" },
    { name: "Yaşıl", value: "#2d5a27" },
    { name: "Bej", value: "#d4b896" },
    { name: "Qəhvəyi", value: "#5c3317" },
    { name: "Mavi", value: "#4a90d9" },
    { name: "Çəhrayı", value: "#e8a0bf" },
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

// ─── Component ─────────────────────────────────────────
export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);

    // Variants
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [customColors, setCustomColors] = useState<{ name: string; value: string }[]>([]);
    const [newColorName, setNewColorName] = useState("");
    const [newColorValue, setNewColorValue] = useState("#6366f1");

    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [customSizes, setCustomSizes] = useState<string[]>([]);
    const [newSizeInput, setNewSizeInput] = useState("");

    // Category cascade
    const [rootCatId, setRootCatId] = useState("");
    const [midCatId, setMidCatId] = useState("");
    const [leafCatId, setLeafCatId] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('id, name, parent_id, slug')
                .order('name');
            if (data) setAllCategories(data);
        };
        fetchCategories();
    }, []);

    // ─── Category Tree Logic ────────────────────────
    const rootCategories = useMemo(() =>
        allCategories.filter(c => c.parent_id === null),
        [allCategories]
    );

    const midCategories = useMemo(() =>
        rootCatId ? allCategories.filter(c => c.parent_id === rootCatId) : [],
        [allCategories, rootCatId]
    );

    const leafCategories = useMemo(() =>
        midCatId ? allCategories.filter(c => c.parent_id === midCatId) : [],
        [allCategories, midCatId]
    );

    const finalCategoryId = leafCatId || midCatId || "";

    // ─── Detect size type from category ─────────────
    const isShoeCategory = useMemo(() => {
        if (midCatId) {
            const mid = allCategories.find(c => c.id === midCatId);
            if (mid && (mid.name.toLowerCase().includes("ayaqqabı") || mid.slug?.includes("shoe"))) return true;
        }
        if (leafCatId) {
            const leaf = allCategories.find(c => c.id === leafCatId);
            if (leaf) {
                const parent = allCategories.find(c => c.id === leaf.parent_id);
                if (parent && (parent.name.toLowerCase().includes("ayaqqabı") || parent.slug?.includes("shoe"))) return true;
            }
        }
        return false;
    }, [midCatId, leafCatId, allCategories]);

    const defaultSizes = isShoeCategory ? SHOE_SIZES : CLOTHING_SIZES;
    const sizeTypeLabel = isShoeCategory ? "Ayaqqabı Ölçüləri" : "Geyim Ölçüləri";

    // Reset sizes when category type changes
    useEffect(() => {
        setSelectedSizes([]);
        setCustomSizes([]);
    }, [isShoeCategory]);

    // ─── All available colors ───────────────────────
    const allColors = useMemo(() => [...COLOR_PRESETS, ...customColors], [customColors]);

    // ─── Discount Calculation ───────────────────────
    const discountedPrice = useMemo(() => {
        const p = parseFloat(price);
        const d = parseInt(discountPercent);
        if (!p || isNaN(p)) return null;
        if (!d || isNaN(d) || d <= 0) return null;
        return (p * (1 - d / 100)).toFixed(2);
    }, [price, discountPercent]);

    // ─── Toggles ────────────────────────────────────
    const toggleColor = (colorVal: string) => {
        setSelectedColors(prev =>
            prev.includes(colorVal) ? prev.filter(c => c !== colorVal) : [...prev, colorVal]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const addCustomColor = () => {
        if (!newColorName.trim()) return;
        if (allColors.some(c => c.value === newColorValue)) return;
        setCustomColors(prev => [...prev, { name: newColorName.trim(), value: newColorValue }]);
        setSelectedColors(prev => [...prev, newColorValue]);
        setNewColorName("");
        setNewColorValue("#6366f1");
    };

    const addCustomSize = () => {
        const s = newSizeInput.trim().toUpperCase();
        if (!s) return;
        if (defaultSizes.includes(s) || customSizes.includes(s)) return;
        setCustomSizes(prev => [...prev, s]);
        setSelectedSizes(prev => [...prev, s]);
        setNewSizeInput("");
    };

    const removeCustomSize = (size: string) => {
        setCustomSizes(prev => prev.filter(s => s !== size));
        setSelectedSizes(prev => prev.filter(s => s !== size));
    };

    const removeCustomColor = (colorVal: string) => {
        setCustomColors(prev => prev.filter(c => c.value !== colorVal));
        setSelectedColors(prev => prev.filter(c => c !== colorVal));
    };

    // ─── Submit ─────────────────────────────────────
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!isValid) return;
        setLoading(true);

        try {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

            const { data: product, error: productError } = await supabase
                .from('products')
                .insert([{
                    name,
                    slug,
                    price: parseFloat(price),
                    discount_percent: parseInt(discountPercent) || 0,
                    category_id: finalCategoryId,
                    description
                }])
                .select()
                .single();

            if (productError) throw productError;

            const productId = product.id;

            if (images.length > 0) {
                const imageInserts = images.map((url, index) => ({
                    product_id: productId,
                    image_url: url,
                    display_order: index
                }));
                await supabase.from('product_images').insert(imageInserts);
            }

            const colors = selectedColors.length > 0 ? selectedColors : ["#000000"];
            const sizes = selectedSizes.length > 0 ? selectedSizes : [defaultSizes[2]]; // M or 40

            const variantInserts = colors.flatMap(color =>
                sizes.map(size => ({
                    product_id: productId,
                    color: allColors.find(c => c.value === color)?.name || color,
                    size,
                    stock: 10
                }))
            );
            await supabase.from('product_variants').insert(variantInserts);

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(`Xəta: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    const isValid = name.trim() && price && finalCategoryId;

    const categoryPath = useMemo(() => {
        const parts: string[] = [];
        if (rootCatId) { const r = allCategories.find(c => c.id === rootCatId); if (r) parts.push(r.name); }
        if (midCatId) { const m = allCategories.find(c => c.id === midCatId); if (m) parts.push(m.name); }
        if (leafCatId) { const l = allCategories.find(c => c.id === leafCatId); if (l) parts.push(l.name); }
        return parts.join(" → ");
    }, [rootCatId, midCatId, leafCatId, allCategories]);

    const allSizes = [...defaultSizes, ...customSizes];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <nav className="flex items-center gap-1 text-xs text-gray-400">
                        <Link href="/admin/products" className="hover:text-gray-600 transition-colors">Məhsullar</Link>
                        <CaretRight size={10} />
                        <span className="text-gray-600">Yeni</span>
                    </nav>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mt-0.5">Yeni Məhsul</h1>
                </div>
                <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading || !isValid}
                    className={cn(
                        "hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isValid && !loading
                            ? "bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                >
                    <FloppyDisk size={16} weight="bold" />
                    {loading ? "Yaradılır..." : "Yarat"}
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    {/* Product Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <TShirt size={16} className="text-gray-400" />
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Məhsul Məlumatları</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-700">Məhsulun Adı *</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Məs: Oversize T-Shirt" className="h-11 rounded-xl border-gray-200" required />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-gray-700">Qiymət (₼) *</Label>
                                    <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="h-11 rounded-xl border-gray-200" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Percent size={12} className="text-gray-400" /> Endirim
                                    </Label>
                                    <Input type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="0" className="h-11 rounded-xl border-gray-200" />
                                </div>
                                {discountedPrice && (
                                    <div className="space-y-1.5 flex flex-col justify-end col-span-2 sm:col-span-1">
                                        <div className="h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center gap-1.5">
                                            <span className="text-xs text-green-600 font-medium">Endirimli:</span>
                                            <span className="text-sm text-green-700 font-bold">{discountedPrice} ₼</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category Cascade */}
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Tag size={12} className="text-gray-400" /> Kateqoriya *
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <select className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all" value={rootCatId} onChange={(e) => { setRootCatId(e.target.value); setMidCatId(""); setLeafCatId(""); }}>
                                        <option value="" disabled>Ana kateqoriya...</option>
                                        {rootCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <select className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all disabled:bg-gray-50 disabled:text-gray-300" value={midCatId} onChange={(e) => { setMidCatId(e.target.value); setLeafCatId(""); }} disabled={!rootCatId || midCategories.length === 0}>
                                        <option value="" disabled>Alt kateqoriya...</option>
                                        {midCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <select className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all disabled:bg-gray-50 disabled:text-gray-300" value={leafCatId} onChange={(e) => setLeafCatId(e.target.value)} disabled={!midCatId || leafCategories.length === 0}>
                                        <option value="" disabled>Son kateqoriya...</option>
                                        {leafCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                </div>
                                {categoryPath && <p className="text-xs text-gray-400 mt-1">{categoryPath}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-700">Təsvir</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Məhsul haqqında qısa təsvir yazın..." className="min-h-[100px] rounded-xl border-gray-200 resize-none text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Variants Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Palette size={16} className="text-gray-400" />
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variantlar</h2>
                        </div>
                        <div className="p-5 space-y-6">
                            {/* ── Sizes ── */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Ruler size={14} className="text-gray-400" />
                                        {sizeTypeLabel}
                                    </Label>
                                    {isShoeCategory ? (
                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-medium">👟 Ayaqqabı</span>
                                    ) : (
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">👕 Geyim</span>
                                    )}
                                </div>

                                {/* Default sizes */}
                                <div className="flex flex-wrap gap-2">
                                    {defaultSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={cn(
                                                "px-3.5 py-2 rounded-xl text-sm font-medium border transition-all",
                                                selectedSizes.includes(size)
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom sizes */}
                                {customSizes.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {customSizes.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={cn(
                                                    "pl-3.5 pr-2 py-2 rounded-xl text-sm font-medium border transition-all inline-flex items-center gap-1.5",
                                                    selectedSizes.includes(size)
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                                )}
                                            >
                                                {size}
                                                <span
                                                    role="button"
                                                    onClick={(e) => { e.stopPropagation(); removeCustomSize(size); }}
                                                    className={cn(
                                                        "w-4 h-4 rounded-full flex items-center justify-center text-[10px] hover:bg-red-500 hover:text-white transition-colors",
                                                        selectedSizes.includes(size) ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                                                    )}
                                                >
                                                    ×
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Add custom size */}
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={newSizeInput}
                                        onChange={(e) => setNewSizeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                                        placeholder={isShoeCategory ? "Məs: 46" : "Məs: 3XL"}
                                        className="h-9 rounded-lg border-gray-200 text-sm w-32"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomSize}
                                        disabled={!newSizeInput.trim()}
                                        className="h-9 px-3 rounded-lg border border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Əlavə et
                                    </button>
                                </div>

                                {selectedSizes.length > 0 && (
                                    <p className="text-xs text-gray-400">{selectedSizes.length} ölçü seçildi</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100" />

                            {/* ── Colors ── */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Palette size={14} className="text-gray-400" />
                                    Rənglər
                                </Label>

                                {/* Preset colors */}
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_PRESETS.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => toggleColor(color.value)}
                                            title={color.name}
                                            className={cn(
                                                "relative w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center",
                                                selectedColors.includes(color.value)
                                                    ? "border-black scale-110 shadow-md"
                                                    : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                            )}
                                            style={{ backgroundColor: color.value }}
                                        >
                                            {selectedColors.includes(color.value) && (
                                                <Check size={14} weight="bold" className={cn(
                                                    color.value === "#FFFFFF" || color.value === "#d4b896" ? "text-black" : "text-white"
                                                )} />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom colors */}
                                {customColors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {customColors.map(color => (
                                            <div key={color.value} className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleColor(color.value)}
                                                    title={color.name}
                                                    className={cn(
                                                        "relative w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center",
                                                        selectedColors.includes(color.value)
                                                            ? "border-black scale-110 shadow-md"
                                                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                                    )}
                                                    style={{ backgroundColor: color.value }}
                                                >
                                                    {selectedColors.includes(color.value) && (
                                                        <Check size={14} weight="bold" className="text-white" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomColor(color.value)}
                                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                                <p className="text-[9px] text-gray-400 text-center mt-0.5 truncate w-10">{color.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add custom color */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={newColorValue}
                                        onChange={(e) => setNewColorValue(e.target.value)}
                                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                                    />
                                    <Input
                                        value={newColorName}
                                        onChange={(e) => setNewColorName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                                        placeholder="Rəng adı (Məs: Narıncı)"
                                        className="h-9 rounded-lg border-gray-200 text-sm w-44"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCustomColor}
                                        disabled={!newColorName.trim()}
                                        className="h-9 px-3 rounded-lg border border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                        <Plus size={12} /> Əlavə et
                                    </button>
                                </div>

                                {selectedColors.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                        {selectedColors.map(c => allColors.find(co => co.value === c)?.name).filter(Boolean).join(", ")}
                                    </p>
                                )}
                            </div>

                            {/* Variant summary */}
                            {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                                <>
                                    <div className="border-t border-gray-100" />
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">
                                                {Math.max(selectedColors.length, 1) * Math.max(selectedSizes.length, 1)}
                                            </span>
                                            {" "}variant yaranacaq (hər biri 10 ədəd stok)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TShirt size={16} className="text-gray-400" />
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Şəkillər</h2>
                            </div>
                            <span className="text-xs text-gray-400">{images.length}/4</span>
                        </div>
                        <div className="p-5">
                            <ImageUpload value={images} onChange={setImages} onRemove={(url) => setImages(images.filter(img => img !== url))} maxImages={4} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Preview */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-6 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Önbaxış</h2>
                            </div>
                            <div className="p-4">
                                <div className="group">
                                    <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                                        {images.length > 0 ? (
                                            <Image src={images[0]} alt={name || "Məhsul"} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <TShirt size={40} className="text-gray-300" />
                                            </div>
                                        )}
                                        {discountedPrice && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{discountPercent}%</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{categoryPath || "Kateqoriya seçilməyib"}</p>
                                        <h3 className="text-sm font-medium text-gray-900 leading-tight">{name || "Məhsul Adı"}</h3>
                                        <div className="flex items-center gap-2">
                                            {discountedPrice ? (
                                                <>
                                                    <span className="text-sm font-bold text-red-600">{discountedPrice} ₼</span>
                                                    <span className="text-xs text-gray-400 line-through">{parseFloat(price).toFixed(2)} ₼</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-900">{price ? `${parseFloat(price).toFixed(2)} ₼` : "0.00 ₼"}</span>
                                            )}
                                        </div>
                                        {selectedColors.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {selectedColors.map(c => (
                                                    <span key={c} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                        )}
                                        {selectedSizes.length > 0 && (
                                            <p className="text-[10px] text-gray-400 mt-0.5">{selectedSizes.join(" · ")}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Submit */}
            <div className="sm:hidden pb-4">
                <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading || !isValid}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all",
                        isValid && !loading
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                >
                    <FloppyDisk size={16} weight="bold" />
                    {loading ? "Yaradılır..." : "Məhsulu Yarat"}
                </button>
            </div>
        </div>
    );
}
