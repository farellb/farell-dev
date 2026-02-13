"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { DatabaseProduct } from "@/services/products";

// Mock colors for now, matching ShopPage logic
const MOCK_COLORS = [
    { name: "Beige", hex: "#f5f5dc", border: "border-gray-200" },
    { name: "Black", hex: "#000000", border: "border-gray-200" },
    { name: "Navy", hex: "#1a2b4b", border: "border-gray-200" }
];

interface ProductGridItemProps {
    product: DatabaseProduct;
    setQuickViewProduct: (p: DatabaseProduct) => void;
    gridCols: number;
}

export const ProductGridItem = ({ product, setQuickViewProduct, gridCols }: ProductGridItemProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    return (
        <div
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
        >
            <div className="relative block aspect-[0.8] w-full overflow-hidden bg-[#f5f5f5]">
                <Link href={`/product/${product.id}`}>
                    <Image
                        src={product.images[currentImageIndex] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </Link>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-400 hover:text-black z-10"
                        >
                            <CaretLeft size={20} weight="light" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-400 hover:text-black z-10"
                        >
                            <CaretRight size={20} weight="light" />
                        </button>
                    </>
                )}

                {/* Quick Add Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                    }}
                    className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center transition-all duration-300 shadow-sm bg-white text-black hover:bg-black hover:text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                    <Plus size={16} weight="regular" />
                </button>

                {/* Sizes Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out flex justify-center items-center gap-6 z-20 border-t border-gray-100">
                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                        <span key={size} className={cn(
                            "text-black font-bold uppercase tracking-widest leading-none",
                            gridCols === 6 ? "text-xs" : "text-sm"
                        )}>
                            {size}
                        </span>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-3 flex flex-col gap-1 w-full">
                <h3 className={cn(
                    "font-normal uppercase tracking-wide text-gray-900 group-hover:underline underline-offset-4 decoration-1 decoration-gray-300 truncate",
                    gridCols === 6 ? "text-xs" : "text-sm"
                )}>
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex justify-between items-center w-full mt-1">
                    <span className={cn(
                        "font-medium text-gray-900",
                        gridCols === 6 ? "text-xs" : "text-sm"
                    )}>{product.price}</span>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1">
                        <span style={{ backgroundColor: MOCK_COLORS[0].hex }} className="w-3 h-3 border border-gray-200 inline-block shadow-sm"></span>
                        <span className="text-xs text-gray-500 font-medium">+2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
