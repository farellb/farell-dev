import { getProductById, getProducts } from "@/services/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getMenuData } from "@/lib/get-menu";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Məhsul tapılmadı</h1>
                <Link href="/shop" className="text-black underline hover:opacity-70">Mağazaya qayıt</Link>
            </div>
        );
    }

    // Fetch related products (simulated by fetching all from category and filtering)
    // The API `getProducts` fetches by category.
    const productsInCategory = await getProducts(product.category);
    const relatedProducts = productsInCategory
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    // Find category label dynamically
    const menuData = await getMenuData();
    const categoryData = menuData.find(c => c.href.includes(`category=${product.category}`));
    const categoryLabel = categoryData?.label || product.category;

    return <ProductDetail product={product} relatedProducts={relatedProducts} categoryLabel={categoryLabel} />;
}
