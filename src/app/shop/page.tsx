import { ShopContainer } from "@/components/shop/ShopContainer";

export const dynamic = 'force-dynamic';


import { getMenuData } from "@/lib/get-menu";
import { getProducts, getFilterOptions } from "@/services/products";

interface PageProps {
    searchParams: Promise<{
        category?: string;
        type?: string;
    }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const category = resolvedParams.category ?? 'all';
    const type = resolvedParams.type;

    // Fetch products, menu data, and filter options in parallel
    const [products, menuData, filterOptions] = await Promise.all([
        getProducts(category),
        getMenuData(),
        getFilterOptions()
    ]);

    return (
        <ShopContainer products={products} menuData={menuData} filterOptions={filterOptions} />
    );
}
