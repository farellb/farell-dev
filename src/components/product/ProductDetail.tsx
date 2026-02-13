"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, WhatsappLogo, Ruler, Minus, Plus, CaretDown, CaretUp, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { DatabaseProduct } from "@/services/products";

// Placeholder WhatsApp Number
// Placeholder WhatsApp Number
const WHATSAPP_NUMBER = "994501234567";

// Helper to get hex color (basic caching/mapping)
const getColorHex = (name: string) => {
    // Basic mapping, could be expanded or fetched from DB in future if needed
    const map: Record<string, string> = {
        'Beige': '#f5f5dc',
        'Black': '#000000',
        'Navy': '#1a2b4b',
        'White': '#ffffff',
        'Red': '#ff0000',
        'Blue': '#0000ff',
        'Green': '#008000',
        'Yellow': '#ffff00',
        'Grey': '#808080',
        'Brown': '#a52a2a'
    };
    return map[name] || '#e5e5e5'; // Default to gray if unknown
};

interface ProductDetailProps {
    product: DatabaseProduct;
    relatedProducts: DatabaseProduct[];
    categoryLabel: string;
}

export function ProductDetail({ product, relatedProducts, categoryLabel }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
    // const [activeImage, setActiveImage] = useState(0); // Not used in new vertical layout

    const handleWhatsAppOrder = () => {
        if (!selectedSize) {
            alert("Zəhmət olmasa, ölçü seçin.");
            return;
        }

        const message = `Salam, Farell Brooklyn. Mən bu məhsulu sifariş etmək istəyirəm:%0A%0A*Məhsul:* ${product.name}%0A*Qiymət:* ${product.price}%0A*Ölçü:* ${selectedSize}%0A*Rəng:* ${selectedColor}%0A%0AStokda mövcuddurmu?`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <main className="pt-24 pb-20 w-full">
                <div className="flex flex-col md:flex-row">
                    {/* Left Column: Scrollable Images */}
                    <div className="w-full md:w-1/2 flex flex-col gap-1">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="relative w-full aspect-[4/5] bg-gray-50">
                                <Image
                                    src={img}
                                    alt={`${product.name} - ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Sticky Info */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="sticky top-24 h-fit p-6 md:p-12 lg:p-16 xl:p-24 flex flex-col min-h-[calc(100vh-6rem)]">

                            {/* Breadcrumb - Moved here */}
                            <div className="mb-6 text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Link href="/" className="hover:text-black">Ana Səhifə</Link>
                                <span>/</span>
                                <Link href={`/shop?category=${product.category}`} className="hover:text-black">{categoryLabel}</Link>
                                <span>/</span>
                                <span className="text-black truncate">{product.name}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-2 text-black leading-tight normal-case">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-xl font-normal text-black">{product.price}</span>
                            </div>

                            {/* Color Selector */}
                            <div className="mb-8">
                                <span className="text-xs text-gray-600 mb-2 block">{selectedColor}</span>
                                <div className="flex gap-3">
                                    {product.colors?.map((colorName, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(colorName)}
                                            style={{ backgroundColor: getColorHex(colorName) }}
                                            className={cn(
                                                "w-6 h-6 border transition-all relative",
                                                selectedColor === colorName
                                                    ? "border-black ring-1 ring-black ring-offset-1"
                                                    : "border-transparent bg-gray-200 hover:bg-gray-300"
                                            )}
                                            title={colorName}
                                        >
                                            {(!getColorHex(colorName) || getColorHex(colorName) === '#e5e5e5') && <span className="text-[6px] text-gray-500 absolute inset-0 flex items-center justify-center overflow-hidden">{colorName.substring(0, 2)}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-black">
                                        Ölçü Seçin
                                    </span>
                                    <SizeGuideModal>
                                        <button className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-black uppercase tracking-wider underline">
                                            Ölçü Cədvəli <CaretRight size={10} />
                                        </button>
                                    </SizeGuideModal>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-10 border border-gray-200 flex items-center justify-start px-4 text-xs font-medium transition-all",
                                                selectedSize === size
                                                    ? "border-black bg-gray-50 ring-1 ring-black"
                                                    : "hover:border-gray-400"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {!selectedSize && (
                                    <p className="text-[10px] text-red-500 mt-2 font-medium animate-pulse">Sifariş üçün zəhmət olmasa ölçü seçin.</p>
                                )}
                            </div>

                            {/* CTA Button */}
                            <div className="mb-8">
                                <Button
                                    size="lg"
                                    onClick={handleWhatsAppOrder}
                                    className={cn(
                                        "w-full h-12 rounded-none uppercase tracking-[0.15em] font-bold text-xs transition-all",
                                        selectedSize
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-black text-white cursor-not-allowed opacity-100 hover:bg-black"
                                    )}
                                    disabled={!selectedSize}
                                >
                                    Səbətə At
                                </Button>
                            </div>

                            {/* Description - Plain Text */}
                            <div className="mb-8 text-sm text-gray-600 leading-relaxed font-light">
                                <p>
                                    {product.description || "Bu məhsul yüksək keyfiyyətli materiallardan hazırlanmışdır. Gündəlik istifadə üçün idealdır və rahatlığı ilə seçilir."}
                                </p>
                                <ul className="mt-4 list-disc pl-4 space-y-1">
                                    <li>Yüksək keyfiyyətli material</li>
                                    <li>Rahat və dayanıqlı</li>
                                    <li>Müasir dizayn</li>
                                </ul>
                            </div>

                            {/* Extra Details Links */}
                            <div className="mt-auto space-y-2 pt-8 border-t border-gray-100/50">
                                <button className="text-xs uppercase tracking-widest font-bold flex items-center justify-between w-full py-2 hover:text-gray-600 transition-colors">
                                    Çatdırılma və Qaytarılma <Plus size={12} />
                                </button>
                                <button className="text-xs uppercase tracking-widest font-bold flex items-center justify-between w-full py-2 hover:text-gray-600 transition-colors">
                                    Məhsul Təfərrüatları <Plus size={12} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* You May Also Like Section */}
                <div className="mt-20 px-4 md:px-8 lg:px-12 mb-20">
                    <h2 className="text-center text-sm font-bold uppercase tracking-widest mb-10">Bəyənə Biləcəyiniz Digər Məhsullar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
                        {relatedProducts.map((p) => (
                            <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer">
                                <div className="relative aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
                                    <Image
                                        src={p.images[0]}
                                        alt={p.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{p.name}</h3>
                                <p className="text-xs text-gray-500">{p.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
