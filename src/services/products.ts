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

export async function getProducts(categoryId?: string, type?: string, limit = 20): Promise<DatabaseProduct[]> {
    let query = supabase
        .from('products')
        .select(`
            *,
            category:categories(slug, name),
            variants:product_variants(size, color, stock),
            images:product_images(image_url, display_order)
        `)
        .eq('is_active', true);

    if (categoryId && categoryId !== 'all') {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', categoryId).single();
        if (cat) {
            query = query.eq('category_id', cat.id);
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
