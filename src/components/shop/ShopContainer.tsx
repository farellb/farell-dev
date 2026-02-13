"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Faders, SquaresFour, CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MenuCategory } from "@/lib/menu-data";
import { DatabaseProduct } from "@/services/products";
import { ProductGridItem } from "./ProductGridItem";

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

interface ShopContainerProps {
    products: DatabaseProduct[];
    menuData: MenuCategory[];
    filterOptions: {
        sizes: string[];
        colors: string[];
    };
}

export function ShopContainer({ products, menuData, filterOptions }: ShopContainerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedCategory = searchParams.get('category') || 'all';
    const selectedType = searchParams.get('type');
    const [gridCols, setGridCols] = useState<4 | 6>(4);

    // Dynamic Toolbar Items based on Category
    const currentMenuCategory = menuData.find(c => c.href.includes(`category=${selectedCategory}`));
    const toolbarItems = currentMenuCategory
        ? currentMenuCategory.subcategories.flatMap(s => s.items)
            .filter(i => !i.href.includes('sort=new') && !i.href.endsWith(`category=${selectedCategory}`))
            .map(item => {
                const type = new URLSearchParams(item.href.split('?')[1]).get('type');
                return { ...item, type };
            })
            .filter(i => i.type)
        : [];

    // Quick View State
    const [quickViewProduct, setQuickViewProduct] = useState<DatabaseProduct | null>(null);
    const [quickViewSize, setQuickViewSize] = useState<string | null>(null);
    const [quickViewColor, setQuickViewColor] = useState<string>("");
    const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);

    // Filter State
    const [selectedSort, setSelectedSort] = useState("Ən Çox Satılanlar");
    const [selectedFilterColor, setSelectedFilterColor] = useState<string | null>(null);
    const [selectedFilterSize, setSelectedFilterSize] = useState<string | null>(null);

    // Reset states when product changes
    useEffect(() => {
        if (quickViewProduct) {
            setQuickViewSize(null);
            setQuickViewImageIndex(0);
            // Default select the first available color for the product
            if (quickViewProduct.colors && quickViewProduct.colors.length > 0) {
                setQuickViewColor(quickViewProduct.colors[0]);
            }
        }
    }, [quickViewProduct]);

    const updateCategory = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id === 'all') {
            params.delete('category');
        } else {
            params.set('category', id);
        }
        params.delete('type'); // Reset type when changing main category
        router.push(`/shop?${params.toString()}`);
    };

    const updateType = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedType === type) {
            params.delete('type');
        } else {
            params.set('type', type);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const nextImage = () => {
        if (!quickViewProduct) return;
        setQuickViewImageIndex((prev) => (prev + 1) % quickViewProduct.images.length);
    };

    const prevImage = () => {
        if (!quickViewProduct) return;
        setQuickViewImageIndex((prev) => (prev - 1 + quickViewProduct.images.length) % quickViewProduct.images.length);
    };

    const filteredProducts = products.filter(p => {
        if (selectedFilterSize) {
            return p.sizes?.includes(selectedFilterSize);
        }
        // Client-side color filtering (since we have colors in product object now)
        if (selectedFilterColor) {
            return p.colors?.includes(selectedFilterColor);
        }
        return true;
    }).sort((a, b) => {
        if (selectedSort === "Qiymət: Artan") {
            return (a.numericPrice || 0) - (b.numericPrice || 0);
        }
        if (selectedSort === "Qiymət: Azalan") {
            return (b.numericPrice || 0) - (a.numericPrice || 0);
        }
        return 0;
    });

    const handleWhatsAppOrder = () => {
        if (!quickViewProduct) return;
        if (!quickViewSize) {
            alert("Zəhmət olmasa, ölçü seçin.");
            return;
        }

        const message = `Salam, Farell Brooklyn. Mən bu məhsulu sifariş etmək istəyirəm:%0A%0A*Məhsul:* ${quickViewProduct.name}%0A*Qiymət:* ${quickViewProduct.price}%0A*Ölçü:* ${quickViewSize}%0A*Rəng:* ${quickViewColor}%0A%0AStokda mövcuddurmu?`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <main className="pb-20">
                <div className="container mx-auto px-4 pt-6 pb-6 flex flex-col items-start justify-center">
                    <nav className="text-[10px] md:text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Link href="/" className="hover:text-black transition-colors">Ana Səhifə</Link>
                        <span>/</span>
                        <Link
                            href={`/shop?category=${selectedCategory}`}
                            onClick={(e) => {
                                e.preventDefault();
                                updateCategory(selectedCategory);
                            }}
                            className={cn(
                                "transition-colors hover:text-black",
                                !selectedType && "text-black font-semibold"
                            )}
                        >
                            {menuData.find(c => c.href.includes(`category=${selectedCategory}`))?.label || "Kolleksiya"}
                        </Link>
                        {selectedType && (
                            <>
                                <span>/</span>
                                <span className="text-black font-semibold">
                                    {toolbarItems.find(t => t.type === selectedType)?.label}
                                </span>
                            </>
                        )}
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black animate-in fade-in slide-in-from-left-2 duration-700">
                        {selectedType
                            ? toolbarItems.find(t => t.type === selectedType)?.label
                            : menuData.find(c => c.href.includes(`category=${selectedCategory}`))?.label || "KOLLEKSİYA"
                        }
                    </h1>
                </div>

                {/* Toolbar */}
                <div className="sticky top-24 z-30 bg-white border-b border-gray-200 transition-all duration-300">
                    <div className="relative container mx-auto px-4 h-14 flex items-center justify-between">
                        {/* Center: Toolbar Items (Desktop) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-6 overflow-x-auto max-w-[60vw] no-scrollbar whitespace-nowrap px-4">
                            {toolbarItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => item.type && updateType(item.type)}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-widest transition-colors shrink-0",
                                        selectedType === item.type ? "text-black border-b border-black" : "text-gray-400 hover:text-black"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        {/* Left: Filter */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
                                    <Faders size={18} />
                                    <span className="hidden sm:inline">Filtr və Sıralama</span>
                                    <span className="sm:hidden">Filtr</span>
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-full sm:w-[480px] bg-white p-0 flex flex-col h-full border-l border-gray-100 sm:max-w-lg"
                            >
                                <SheetHeader className="p-6 border-b border-gray-100">
                                    <SheetTitle className="text-base font-bold uppercase tracking-[0.2em]">Filtr və Sıralama</SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <div className="space-y-12">
                                        {/* Sort Section */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Sıralama</h3>
                                            <div className="space-y-3">
                                                {["Ən Çox Satılanlar", "Yenilər", "Qiymət: Artan", "Qiymət: Azalan"].map((sort) => (
                                                    <div
                                                        key={sort}
                                                        className="flex items-center gap-3 cursor-pointer group py-1"
                                                        onClick={() => setSelectedSort(sort)}
                                                    >
                                                        <div className={cn(
                                                            "w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center transition-colors",
                                                            selectedSort === sort ? "border-black" : "group-hover:border-gray-400"
                                                        )}>
                                                            {selectedSort === sort && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-xs font-medium uppercase tracking-wide transition-colors",
                                                            selectedSort === sort ? "text-black" : "text-gray-500 group-hover:text-black"
                                                        )}>
                                                            {sort}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Colors Section */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Rəng</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {filterOptions.colors.map((colorName) => (
                                                    <button
                                                        key={colorName}
                                                        onClick={() => setSelectedFilterColor(selectedFilterColor === colorName ? null : colorName)}
                                                        className={cn(
                                                            "w-10 h-10 border transition-all hover:border-gray-400 relative",
                                                            selectedFilterColor === colorName ? "border-black ring-1 ring-black ring-offset-2" : "border-gray-200"
                                                        )}
                                                        title={colorName}
                                                        style={{ backgroundColor: getColorHex(colorName) }}
                                                    >
                                                        {(!getColorHex(colorName) || getColorHex(colorName) === '#e5e5e5') && <span className="text-[8px] text-gray-500 absolute inset-0 flex items-center justify-center overflow-hidden">{colorName.substring(0, 2)}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sizes Section */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Ölçü</h3>
                                            <div className="grid grid-cols-4 gap-2">
                                                {filterOptions.sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedFilterSize(selectedFilterSize === size ? null : size)}
                                                        className={cn(
                                                            "h-10 border flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all",
                                                            selectedFilterSize === size
                                                                ? "border-black bg-black text-white"
                                                                : "border-gray-200 text-gray-900 hover:border-black"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-6">
                                    <SheetClose asChild>
                                        <Button className="w-full bg-black text-white h-14 text-xs font-bold uppercase tracking-[0.2em] rounded-none transition-all border border-black hover:bg-white hover:text-black">
                                            NƏTİCƏLƏRİ GÖSTƏR
                                        </Button>
                                    </SheetClose>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Right: View Switcher */}
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:inline">
                                {filteredProducts.length} Məhsul
                            </span>
                            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setGridCols(4)} className={cn("p-1", gridCols === 4 ? "text-black" : "text-gray-300")}><SquaresFour size={20} weight={gridCols === 4 ? "fill" : "regular"} /></button>
                                <button onClick={() => setGridCols(6)} className={cn("p-1 hidden lg:block", gridCols === 6 ? "text-black" : "text-gray-300")}><div className="flex gap-0.5"><div className="w-0.5 h-3 bg-current" /><div className="w-0.5 h-3 bg-current" /><div className="w-0.5 h-3 bg-current" /><div className="w-0.5 h-3 bg-current" /><div className="w-0.5 h-3 bg-current" /><div className="w-0.5 h-3 bg-current" /></div></button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Toolbar Items */}
                    {(toolbarItems.length > 0) && (
                        <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-3 px-4 border-t border-gray-100 flex items-center gap-6 bg-white">
                            {toolbarItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => item.type && updateType(item.type)}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-widest transition-colors shrink-0",
                                        selectedType === item.type ? "text-black border-b border-black" : "text-gray-400 hover:text-black"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="container mx-auto px-2 sm:px-4">
                    {filteredProducts.length === 0 ? (
                        <div className="py-32 flex flex-col items-center text-gray-400 font-light text-center">
                            <p className="mb-4">Bu kateqoriyada məhsul tapılmadı.</p>
                            <Button onClick={() => updateCategory('all')} variant="link" className="text-black underline">Bütün kolleksiyaya qayıt</Button>
                        </div>
                    ) : (
                        <div className={cn(
                            "grid gap-x-1 gap-y-10 sm:gap-x-4 sm:gap-y-12 transition-all duration-500",
                            gridCols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
                        )}>
                            {filteredProducts.map((product) => (
                                <ProductGridItem
                                    key={product.id}
                                    product={product}
                                    setQuickViewProduct={setQuickViewProduct}
                                    gridCols={gridCols}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick View Sheet (Right Side) */}
                <Sheet open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
                    <SheetContent
                        side="right"
                        className="w-full sm:w-[480px] p-0 border-l border-gray-100 bg-white sm:max-w-lg"
                    >
                        <SheetHeader className="sr-only">
                            <SheetTitle>Məhsul Baxışı</SheetTitle>
                        </SheetHeader>
                        {quickViewProduct && (
                            <div className="flex flex-col h-full bg-white">
                                {/* Image Section */}
                                <div className="relative aspect-square w-full bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={(quickViewProduct.images && quickViewProduct.images[quickViewImageIndex]) || '/placeholder.png'}
                                        alt={quickViewProduct.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Carousel Navigation */}
                                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={prevImage} className="bg-white/80 p-2 rounded-full hover:bg-white shadow-sm">
                                            <CaretLeft size={20} />
                                        </button>
                                        <button onClick={nextImage} className="bg-white/80 p-2 rounded-full hover:bg-white shadow-sm">
                                            <CaretRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="p-6 flex-1 flex flex-col overflow-y-auto">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-sm font-bold uppercase tracking-widest leading-snug pr-4">{quickViewProduct.name}</h2>
                                        <span className="text-sm font-medium whitespace-nowrap">{quickViewProduct.price}</span>
                                    </div>

                                    {/* Colors */}
                                    <div className="mb-6">
                                        <span className="text-xs text-gray-500 mb-2 block">{quickViewColor}</span>
                                        <div className="flex gap-3">
                                            {quickViewProduct.colors?.map((colorName) => (
                                                <button
                                                    key={colorName}
                                                    onClick={() => setQuickViewColor(colorName)}
                                                    style={{ backgroundColor: getColorHex(colorName) }}
                                                    className={cn(
                                                        "w-6 h-6 border transition-all ring-1 ring-offset-2 relative",
                                                        quickViewColor === colorName ? "ring-black scale-110" : "ring-transparent hover:ring-gray-300",
                                                        (!getColorHex(colorName) || getColorHex(colorName) === '#e5e5e5') ? "border-gray-200" : "border-gray-200"
                                                    )}
                                                >
                                                    {(!getColorHex(colorName) || getColorHex(colorName) === '#e5e5e5') && <span className="text-[6px] text-gray-500 absolute inset-0 flex items-center justify-center overflow-hidden">{colorName.substring(0, 2)}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold uppercase tracking-widest">Ölçü Seçin</span>

                                            {/* Size Guide Dialog */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-black uppercase tracking-wider">
                                                        ÖLÇÜ CƏDVƏLİ <Plus size={10} />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader className="border-b pb-4 mb-6">
                                                        <DialogTitle className="uppercase tracking-widest font-bold text-center text-xl">ÖLÇÜ VƏ UYĞUNLUQ</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="text-center">Ölçü cədvəli burada olacaq...</div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {quickViewProduct.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setQuickViewSize(size)}
                                                    className={cn(
                                                        "h-14 border flex items-start justify-start p-2 transition-all hover:border-black",
                                                        quickViewSize === size
                                                            ? "border-black bg-gray-50"
                                                            : "border-gray-200"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "text-xs font-bold uppercase tracking-widest",
                                                        quickViewSize === size ? "text-black" : "text-gray-900"
                                                    )}>
                                                        {size}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <Button
                                            className={cn(
                                                "w-full h-12 rounded-none uppercase tracking-[0.1em] font-bold text-xs hover:bg-gray-800 transition-all mb-4",
                                                quickViewSize ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            )}
                                            disabled={!quickViewSize}
                                            onClick={handleWhatsAppOrder}
                                        >
                                            WhatsApp ilə Sifariş
                                        </Button>
                                        <Link
                                            href={`/product/${quickViewProduct.id}`}
                                            className="flex justify-between items-center w-full py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors group"
                                        >
                                            MƏHSULUN SƏHİFƏSİNƏ BAX
                                            <CaretRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </main>

            <Footer />
        </div>
    );
}
