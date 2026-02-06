"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Faders, SquaresFour, Rows, Plus, X, CaretLeft, CaretRight, Ruler } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { PRODUCTS, Product } from "@/lib/products";
import { cn } from "@/lib/utils";

// Placeholder WhatsApp Number
const WHATSAPP_NUMBER = "994501234567";

import { MENU_DATA } from "@/lib/menu-data";

const CATEGORIES = [
    { id: "all", label: "Hamısı" },
    { id: "women", label: "Qadın" },
    { id: "men", label: "Kişi" },
    { id: "kids", label: "Uşaq" },
    { id: "accessories", label: "Aksesuar" },
];

const MOCK_COLORS = [
    { name: "Beige", hex: "#f5f5dc", border: "border-gray-200" },
    { name: "Black", hex: "#000000", border: "border-gray-200" },
    { name: "Navy", hex: "#1a2b4b", border: "border-gray-200" }
];

const ProductGridItem = ({ product, setQuickViewProduct, gridCols }: { product: Product, setQuickViewProduct: (p: Product) => void, gridCols: number }) => {
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
                        src={product.images[currentImageIndex]}
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
                    {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
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

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedCategory = searchParams.get('category') || 'all';
    const selectedType = searchParams.get('type');
    const [gridCols, setGridCols] = useState<4 | 6>(4);

    // Dynamic Toolbar Items based on Category
    const currentMenuCategory = MENU_DATA.find(c => c.href.includes(`category=${selectedCategory}`));
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
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [quickViewSize, setQuickViewSize] = useState<string | null>(null);
    const [quickViewColor, setQuickViewColor] = useState<string>(MOCK_COLORS[0].name);
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
            setQuickViewColor(MOCK_COLORS[0].name);
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

    const filteredProducts = PRODUCTS.filter(p => {
        const categoryMatch = selectedCategory === "all" || p.category === selectedCategory;
        const typeMatch = !selectedType || p.type === selectedType;
        return categoryMatch && typeMatch;
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
            <Header />

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
                            {CATEGORIES.find(c => c.id === selectedCategory)?.label || "Kolleksiya"}
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
                            : CATEGORIES.find(c => c.id === selectedCategory)?.label || "KOLLEKSİYA"
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
                                className="w-full sm:w-[480px] bg-white p-0 flex flex-col h-full border-l border-gray-100 sm:max-w-lg duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
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
                                                {MOCK_COLORS.map((color) => (
                                                    <button
                                                        key={color.name}
                                                        onClick={() => setSelectedFilterColor(selectedFilterColor === color.name ? null : color.name)}
                                                        className={cn(
                                                            "w-10 h-10 border transition-all hover:border-gray-400",
                                                            selectedFilterColor === color.name ? "border-black ring-1 ring-black ring-offset-2" : "border-gray-200"
                                                        )}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sizes Section */}
                                        <div>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Ölçü</h3>
                                            <div className="grid grid-cols-4 gap-2">
                                                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
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
                                    <div className="relative h-6 w-full opacity-90">
                                        <Image
                                            src="/logo2.png"
                                            alt="Farell Brooklyn"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
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
                        className="w-full sm:w-[480px] p-0 border-l border-gray-100 bg-white sm:max-w-lg duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                    >
                        <SheetHeader className="sr-only">
                            <SheetTitle>Məhsul Baxışı</SheetTitle>
                        </SheetHeader>
                        {quickViewProduct && (
                            <div className="flex flex-col h-full bg-white">
                                {/* Image Section */}
                                <div className="relative aspect-square w-full bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={quickViewProduct.images[quickViewImageIndex]}
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

                                    {/* Dots Indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {quickViewProduct.images.slice(0, 5).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full shadow-sm transition-all",
                                                    quickViewImageIndex === idx ? "bg-white scale-110" : "bg-white/50"
                                                )}
                                            />
                                        ))}
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
                                            {MOCK_COLORS.map((color) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setQuickViewColor(color.name)}
                                                    style={{ backgroundColor: color.hex }}
                                                    className={cn(
                                                        "w-6 h-6 border transition-all ring-1 ring-offset-2",
                                                        color.border,
                                                        quickViewColor === color.name ? "ring-black scale-110" : "ring-transparent hover:ring-gray-300"
                                                    )}
                                                />
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

                                                    <div className="space-y-10">
                                                        {/* Header */}
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="text-xs font-bold uppercase tracking-widest">BƏDƏN ÖLÇÜLƏRİ</h3>
                                                        </div>

                                                        {/* Table */}
                                                        <div className="border border-gray-200">
                                                            <table className="w-full text-xs text-center border-collapse">
                                                                <thead className="bg-white border-b border-gray-200">
                                                                    <tr>
                                                                        <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Ölçü</th>
                                                                        <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Avropa (EU)</th>
                                                                        <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Sinə (cm)</th>
                                                                        <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Qol (cm)</th>
                                                                        <th className="py-4 font-bold uppercase w-1/5">Bel (cm)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-100 font-medium">
                                                                    {/* XS */}
                                                                    <tr className="hover:bg-gray-50">
                                                                        <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>XS</td>
                                                                        <td className="py-2 border-r border-gray-200">40</td>
                                                                        <td className="py-2 border-r border-gray-200">80</td>
                                                                        <td className="py-2 border-r border-gray-200">61.5</td>
                                                                        <td className="py-2">68</td>
                                                                    </tr>
                                                                    <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                                                        <td className="py-2 border-r border-gray-200">42</td>
                                                                        <td className="py-2 border-r border-gray-200">84</td>
                                                                        <td className="py-2 border-r border-gray-200">62</td>
                                                                        <td className="py-2">72</td>
                                                                    </tr>

                                                                    {/* S */}
                                                                    <tr className="hover:bg-gray-50">
                                                                        <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>S</td>
                                                                        <td className="py-2 border-r border-gray-200">44</td>
                                                                        <td className="py-2 border-r border-gray-200">88</td>
                                                                        <td className="py-2 border-r border-gray-200">62.5</td>
                                                                        <td className="py-2">76</td>
                                                                    </tr>
                                                                    <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                                                        <td className="py-2 border-r border-gray-200">46</td>
                                                                        <td className="py-2 border-r border-gray-200">92</td>
                                                                        <td className="py-2 border-r border-gray-200">63</td>
                                                                        <td className="py-2">80</td>
                                                                    </tr>

                                                                    {/* M */}
                                                                    <tr className="hover:bg-gray-50">
                                                                        <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>M</td>
                                                                        <td className="py-2 border-r border-gray-200">48</td>
                                                                        <td className="py-2 border-r border-gray-200">96</td>
                                                                        <td className="py-2 border-r border-gray-200">63.5</td>
                                                                        <td className="py-2">84</td>
                                                                    </tr>
                                                                    <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                                                        <td className="py-2 border-r border-gray-200">50</td>
                                                                        <td className="py-2 border-r border-gray-200">100</td>
                                                                        <td className="py-2 border-r border-gray-200">64</td>
                                                                        <td className="py-2">88</td>
                                                                    </tr>

                                                                    {/* L */}
                                                                    <tr className="hover:bg-gray-50">
                                                                        <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>L</td>
                                                                        <td className="py-2 border-r border-gray-200">52</td>
                                                                        <td className="py-2 border-r border-gray-200">104</td>
                                                                        <td className="py-2 border-r border-gray-200">64.5</td>
                                                                        <td className="py-2">92</td>
                                                                    </tr>
                                                                    <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                                                        <td className="py-2 border-r border-gray-200">54</td>
                                                                        <td className="py-2 border-r border-gray-200">108</td>
                                                                        <td className="py-2 border-r border-gray-200">65</td>
                                                                        <td className="py-2">96</td>
                                                                    </tr>

                                                                    {/* XL */}
                                                                    <tr className="hover:bg-gray-50">
                                                                        <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>XL</td>
                                                                        <td className="py-2 border-r border-gray-200">56</td>
                                                                        <td className="py-2 border-r border-gray-200">112</td>
                                                                        <td className="py-2 border-r border-gray-200">65.5</td>
                                                                        <td className="py-2">100</td>
                                                                    </tr>
                                                                    <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                                                        <td className="py-2 border-r border-gray-200">58</td>
                                                                        <td className="py-2 border-r border-gray-200">116</td>
                                                                        <td className="py-2 border-r border-gray-200">66</td>
                                                                        <td className="py-2">104</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {/* Visual Guide Section */}
                                                        <div className="py-6">
                                                            {/* Body Diagram with Labels */}
                                                            <div className="flex justify-center mb-10">
                                                                <svg width="326" height="530" viewBox="0 0 326 530" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto text-gray-900">
                                                                    <defs>
                                                                        <mask id="mask_full_body" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="50" y="0" width="226" height="530">
                                                                            <path d="M280 0H40V530H280V0Z" fill="white" />
                                                                        </mask>
                                                                    </defs>
                                                                    <g mask="url(#mask_full_body)">
                                                                        {/* Body Paths - Unmasked to show full hands and legs */}
                                                                        <path d="M142.177 0C142.177 0 143.28 18.266 142.177 19.9272C141.074 21.5885 136.222 22.4585 125.014 25.752C115.432 25.752 101.101 29.3296 97.7649 32.6392C91.6022 38.7538 91.4794 44.7212 89.7576 53.2303C84.29 80.2505 87.9609 126.388 87.9609 126.388C87.9609 126.388 84.178 140.08 82.6073 149.045C78.3022 173.616 81.4095 212.921 81.4095 212.921C81.4095 212.921 78.2381 227.001 81.4095 235.032C85.4354 245.227 98.88 253.321 102.702 253.321C106.523 253.321 81.7357 236.082 87.9609 226.977C92.8745 219.791 99.562 240.092 100.161 235.032C100.76 229.972 99.7691 227.534 98.0693 217.562C96.867 210.508 92.8745 207.189 92.8745 207.189V191.629C92.8745 191.629 100.796 166.979 103.521 150.683C105.341 139.791 106.523 122.566 106.523 122.566L114.114 89.263" stroke="currentColor" strokeWidth="0.8" />
                                                                        <path d="M114.113 89.2612C114.113 89.2612 117.287 103.057 118.208 112.191C118.967 119.722 118.754 135.166 118.754 135.166C118.754 135.166 112.608 153.439 110.565 167.878C109.216 177.407 106.75 182.835 106.258 192.446C105.311 210.971 105.225 243.224 106.748 261.711C107.578 271.779 115.731 323.995 115.731 323.995L118.127 340.165C118.127 344.956 110.641 368.911 113.635 389.872C116.63 410.833 128.008 461.439 128.008 461.439C128.008 461.439 126.654 465.926 126.511 469.224C126.391 472.001 126.511 476.111 126.511 476.111C126.511 476.111 129.188 493.219 123.199 503.999C117.211 514.779 128.328 516.404 134.933 520.532C139.199 523.199 149.269 517.434 149.269 517.434L145.975 480.603L144.533 474.132C144.533 474.132 145.851 471.069 145.975 469.224C146.195 465.93 145.975 461.439 145.975 461.439L150.766 358.73" stroke="currentColor" strokeWidth="0.8" />
                                                                        <path d="M160.051 203.32C160.051 203.32 157.635 222.611 157.837 235.304C158.487 276.197 151.966 339.866 151.966 339.866L149.57 348.55L150.768 359.03" stroke="currentColor" strokeWidth="0.8" />
                                                                        <path d="M177.823 0C177.823 0 176.72 18.266 177.823 19.9272C178.926 21.5885 183.778 22.4585 194.986 25.752C204.568 25.752 218.899 29.3296 222.235 32.6392C228.398 38.7538 228.521 44.7212 230.242 53.2303C235.71 80.2505 232.039 126.388 232.039 126.388C232.039 126.388 235.822 140.08 237.393 149.045C241.698 173.616 238.59 212.921 238.59 212.921C238.59 212.921 241.762 227.001 238.59 235.032C234.565 245.227 221.12 253.321 217.298 253.321C213.477 253.321 237.256 222.48 227.126 226.843C219.898 229.955 218.496 251.411 216.585 243.221C214.674 235.032 217.163 226.484 221.931 217.562C224.363 213.01 227.126 207.189 227.126 207.189V191.629C227.126 191.629 219.204 166.979 216.479 150.683C214.659 139.791 213.477 122.566 213.477 122.566L205.886 89.263" stroke="currentColor" strokeWidth="0.8" />
                                                                        <path d="M205.887 89.2612C205.887 89.2612 202.713 103.057 201.793 112.191C201.033 119.722 201.247 135.166 201.247 135.166C201.247 135.166 207.392 153.439 209.436 167.878C210.784 177.407 211.454 182.835 211.946 192.446C212.893 210.971 214.776 243.224 213.253 261.711C212.423 271.779 204.269 323.995 204.269 323.995L201.874 340.165C201.874 344.956 209.36 368.911 206.365 389.872C203.371 410.833 191.992 461.439 191.992 461.439C191.992 461.439 193.346 465.926 193.489 469.224C193.61 472.001 193.489 476.111 193.489 476.111C193.489 476.111 193.776 501.865 197.331 508.265C200.887 514.665 191.992 517.434 185.598 521.599C179.944 525.281 170.732 517.434 170.732 517.434L174.026 480.603L174.931 473.599C174.931 473.599 174.149 471.069 174.026 469.224C173.805 465.93 174.026 461.439 174.026 461.439L169.235 358.73" stroke="currentColor" strokeWidth="0.8" />
                                                                        <path d="M160.051 203.32C160.051 203.32 162.369 222.611 162.167 235.304C161.517 276.197 168.038 339.866 168.038 339.866L170.434 348.55L169.236 359.03" stroke="currentColor" strokeWidth="0.8" />
                                                                    </g>

                                                                    {/* Measurements & Labels - Text in Box */}
                                                                    {/* CHEST */}
                                                                    <path d="M97 62L102 64.8868V59.1132L97 62ZM220 62L215 59.1132V64.8868L220 62ZM101.5 62.5H215.5V61.5H101.5V62.5Z" fill="#080808" fillOpacity="0.15" />
                                                                    <rect x="133" y="52" width="54" height="20" fill="#F3F3F3" />
                                                                    <text x="160" y="65" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">SİNƏ</text>

                                                                    {/* WAIST */}
                                                                    <path d="M97 133L102 135.887V130.113L97 133ZM220 133L215 130.113V135.887L220 133ZM101.5 133.5H215.5V132.5H101.5V133.5Z" fill="#080808" fillOpacity="0.15" />
                                                                    <rect x="133" y="123" width="54" height="20" fill="#F3F3F3" />
                                                                    <text x="160" y="136" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">BEL</text>

                                                                    {/* HIPS (KALÇA) */}
                                                                    <path d="M97 204L102 206.887V201.113L97 204ZM220 204L215 201.113V206.887L220 204ZM101.5 204.5H215.5V203.5H101.5V204.5Z" fill="#080808" fillOpacity="0.15" />
                                                                    <rect x="133" y="196" width="54" height="20" fill="#F3F3F3" />
                                                                    <text x="160" y="209" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">KALÇA</text>

                                                                    {/* ARM LENGTH */}
                                                                    <path d="M232 53 L229 58 H235 Z" fill="#080808" fillOpacity="0.15" />
                                                                    <path d="M232 230 L229 225 H235 Z" fill="#080808" fillOpacity="0.15" />
                                                                    <line x1="232" y1="56" x2="232" y2="227" stroke="#080808" strokeOpacity="0.15" strokeWidth="1" />
                                                                    <rect x="238" y="135" width="70" height="20" fill="#F3F3F3" />
                                                                    <text x="273" y="148" fontSize="9" fill="#000" textAnchor="middle" fontWeight="bold">QOL UZUNLUĞU</text>
                                                                </svg>
                                                            </div>

                                                            {/* Instructions List - Split Layout Title Left / Description Right */}
                                                            <div className="space-y-8 max-w-3xl mx-auto px-4">
                                                                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                                                    <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Sinə</h4>
                                                                    <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                                                        Lentinizi sinənizin ən geniş hissəsinə üfüqi şəkildə tutaraq ölçün.
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                                                    <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Bel</h4>
                                                                    <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                                                        Təbii bel xəttinizin ətrafını, ən incə nöqtədən ölçün.
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                                                    <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Kalça</h4>
                                                                    <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                                                        Ayaqlarınızı birləşdirərək, kalçanızın ən geniş hissəsini ölçün.
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                                                    <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Qol Uzunluğu</h4>
                                                                    <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                                                        Çiyin nöqtəsindən biləyinizə qədər olan məsafəni ölçün.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                        {!quickViewSize && <p className="text-[10px] text-red-500 mt-2 h-3"> </p>}
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

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}
