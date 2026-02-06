"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, WhatsappLogo, Ruler } from "@phosphor-icons/react";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

// Placeholder WhatsApp Number - Replace with actual number
const WHATSAPP_NUMBER = "994501234567";

export default function ProductPage() {
    // Using useParams hook for Client Component compatibility
    const params = useParams();
    const productId = params?.id;

    const product = PRODUCTS.find((p) => p.id.toString() === productId);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    if (!productId) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        // We can't use notFound() easily in client components effectively during initial render safely in all cases, 
        // but usually it Redirects. Let's try basic not found UI or just return null
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Məhsul tapılmadı</h1>
                <Link href="/shop" className="text-blue-600 underline">Mağazaya qayıt</Link>
            </div>
        );
    }

    const handleWhatsAppOrder = () => {
        if (!selectedSize) {
            alert("Zəhmət olmasa, ölçü seçin.");
            return;
        }

        const message = `Salam, Farell Brooklyn. Mən bu məhsulu sifariş etmək istəyirəm:%0A%0A*Məhsul:* ${product.name}%0A*Qiymət:* ${product.price}%0A*Ölçü:* ${selectedSize}%0A%0AStokda mövcuddurmu?`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <Header />

            <main className="pt-32 pb-20 container mx-auto px-4 md:px-0 max-w-6xl">
                {/* Breadcrumb / Back */}
                <div className="mb-8 px-4 md:px-0">
                    <Link href="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="mr-2" size={16} />
                        MAĞAZAYA QAYIT
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Left: Images */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails (Desktop: Left, Mobile: Bottom) */}
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={cn(
                                        "relative w-20 h-24 md:w-24 md:h-32 shrink-0 border transition-all",
                                        activeImage === idx ? "border-black" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative aspect-[3/4] bg-gray-50">
                            <Image
                                src={product.images[activeImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="px-4 md:px-0 py-4 md:py-8 flex flex-col h-full">
                        <h1 className="text-3xl md:text-4xl font-light uppercase tracking-wide mb-2">{product.name}</h1>
                        <p className="text-xl font-medium mb-8">{product.price}</p>

                        <div className="prose prose-sm text-gray-600 mb-10 max-w-none">
                            <p>{product.description}</p>
                        </div>

                        {/* Sizes */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold uppercase tracking-widest">Ölçü Seçin</span>
                                <button className="text-xs text-gray-500 underline flex items-center gap-1 hover:text-black">
                                    <Ruler size={14} /> Ölçü Cədvəli
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "h-12 border flex items-center justify-center text-sm font-medium transition-all",
                                            selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-black text-black"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="text-xs text-red-500 mt-2">Sifariş üçün zəhmət olmasa ölçü seçin.</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto">
                            <Button
                                size="lg"
                                onClick={handleWhatsAppOrder}
                                className={cn(
                                    "w-full h-14 rounded-none uppercase tracking-[0.15em] font-bold text-sm transition-all",
                                    selectedSize
                                        ? "bg-[#25D366] hover:bg-[#128C7E] text-white"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200"
                                )}
                                disabled={!selectedSize}
                            >
                                <WhatsappLogo size={20} className="mr-2" weight="bold" />
                                WHATSAPP İLƏ SİFARİŞ
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Sifariş birbaşa WhatsApp üzərindən rəsmiləşdirilir. Ödəniş və çatdırılma detalları orada müzakirə olunur.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
