import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/products'; // Re-using interface for now, might need updating

// Extended Product Type from DB (if needed)
export interface DatabaseProduct extends Product {
    id: string;
    category_id?: string;
    colors: string[]; // Added colors
}

export async function getProductById(id: string): Promise<DatabaseProduct | null> {
    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(slug, name),
      variants:product_variants(size, color, stock),
      images:product_images(image_url, display_order)
    `)
        .eq('id', id)
        .single();

    if (error || !product) {
        console.error('Error fetching product:', error);
        return null;
    }

    const sortedImages = (product.images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.image_url);

    const sizes = Array.from(new Set((product.variants || []).map((v: any) => v.size))).sort();
    const colors = Array.from(new Set((product.variants || []).map((v: any) => v.color))).filter(Boolean).sort();

    return {
        ...product,
        id: product.id,
        category: product.category?.slug || 'all',
        images: sortedImages,
        sizes,
        colors,
        numericPrice: product.price,
        price: `${product.price} AZN`
    };
}

export async function getProducts(categorySlug?: string, typeSlug?: string, limit = 20): Promise<DatabaseProduct[]> {
    // First, fetch all categories to resolve hierarchy
    const { data: allCategories } = await supabase
        .from('categories')
        .select('id, slug, parent_id');

    let query = supabase
        .from('products')
        .select(`
            *,
            category:categories(slug, name),
            variants:product_variants(size, color, stock),
            images:product_images(image_url, display_order)
        `)
        .eq('is_active', true);

    if (allCategories && categorySlug && categorySlug !== 'all') {
        // Find the root category by slug (e.g., "men")
        const rootCat = allCategories.find(c => c.slug === categorySlug && !c.parent_id);

        if (typeSlug) {
            // Type slug is a specific subcategory (e.g., "t-shirts")
            // Find the exact category with this slug under the root
            const typeCat = allCategories.find(c => c.slug === typeSlug);

            if (typeCat) {
                // Collect this category AND all its children (leaf categories)
                const childIds = allCategories
                    .filter(c => c.parent_id === typeCat.id)
                    .map(c => c.id);

                const matchingIds = [typeCat.id, ...childIds];
                query = query.in('category_id', matchingIds);
            }
        } else if (rootCat) {
            // No type specified — show ALL products under this root category
            // Collect root + all children + all grandchildren
            const childIds = allCategories
                .filter(c => c.parent_id === rootCat.id)
                .map(c => c.id);

            const grandchildIds = allCategories
                .filter(c => childIds.includes(c.parent_id!))
                .map(c => c.id);

            const allMatchingIds = [rootCat.id, ...childIds, ...grandchildIds];
            query = query.in('category_id', allMatchingIds);
        }
    }

    const { data, error } = await query.limit(limit);

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return (data || []).map((product: any) => {
        const sortedImages = (product.images || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url);

        const sizes = Array.from(new Set((product.variants || []).map((v: any) => v.size))).sort();
        const colors = Array.from(new Set((product.variants || []).map((v: any) => v.color))).filter(Boolean).sort();

        return {
            ...product,
            id: product.id,
            category: product.category?.slug || 'all',
            images: sortedImages,
            sizes,
            colors,
            numericPrice: product.price,
            price: `${product.price} AZN`
        };
    });
}

export async function getFilterOptions() {
    const { data: variants, error } = await supabase
        .from('product_variants')
        .select('size, color');

    if (error) {
        console.error('Error fetching filter options:', error);
        return { sizes: [], colors: [] };
    }

    const sizes = Array.from(new Set(variants.map(v => v.size))).filter(Boolean).sort();
    const colors = Array.from(new Set(variants.map(v => v.color))).filter(Boolean).sort();

    return { sizes, colors };
}
