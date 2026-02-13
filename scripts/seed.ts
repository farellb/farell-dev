import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using Anon key for simplicity if RLS allows, or ask for Service Role if needed. 
// Actually, seeding usually requires Service Role key to bypass RLS, or RLS must be open. 
// For now, we will try with Anon Key and assume RLS is open or not set yet (which is true based on my previous steps).

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

import { PRODUCTS } from '../src/lib/products';
import { MENU_DATA } from '../src/lib/menu-data';

// Helper to generate slugs
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Seed Categories
    console.log('Creating categories...');
    const categoryMap = new Map<string, string>(); // slug -> uuid

    for (const cat of MENU_DATA) {
        const slug = slugify(cat.label); // e.g., 'kisi', 'qadin'
        // Note: our mock data uses English slugs like 'men', 'women' in hrefs. 
        // We should map them correctly. 
        // MENU_DATA href is like '/shop?category=men'. We can extract 'men' from there or just use the label.
        // The products use 'women', 'men', 'kids', 'accessories'.
        // Let's use the explicit IDs from the MENU_DATA hrefs or hardcode the mapping to match Products.

        let dbSlug = '';
        if (cat.href.includes('category=men')) dbSlug = 'men';
        else if (cat.href.includes('category=women')) dbSlug = 'women';
        else if (cat.href.includes('category=kids')) dbSlug = 'kids';
        else if (cat.href.includes('category=accessories')) dbSlug = 'accessories';
        else dbSlug = slug;

        const { data: parent, error: parentError } = await supabase
            .from('categories')
            .upsert({
                name: cat.label,
                slug: dbSlug,
                parent_id: null
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (parentError) {
            console.error(`Error creating parent category ${cat.label}:`, parentError);
            continue;
        }

        categoryMap.set(dbSlug, parent.id);

        // Subcategories
        for (const subGroup of cat.subcategories) {
            for (const item of subGroup.items) {
                // Extract type from href: /shop?category=men&type=t-shirts -> t-shirts
                const typeMatch = item.href.match(/type=([^&]+)/);
                if (typeMatch) {
                    const typeSlug = typeMatch[1];
                    await supabase
                        .from('categories')
                        .upsert({
                            name: item.label,
                            // To avoid clashes across parents (e.g. men's t-shirt vs women's t-shirt), we use unique slugs like 'men-t-shirts'.
                            slug: `${dbSlug}-${typeSlug}`,
                            parent_id: parent.id
                        }, { onConflict: 'slug' });
                }
            }
        }
    }

    // 2. Seed Products
    console.log('Creating products...');
    for (const p of PRODUCTS) {
        // Determine category ID
        // Product category field is like 'women', 'men'
        const catId = categoryMap.get(p.category);

        if (!catId) {
            console.warn(`Category not found for product ${p.name} (${p.category}). Skipping.`);
            continue;
        }

        // Insert Product
        const productSlug = slugify(`${p.name}-${p.id}`);
        const { data: prodData, error: prodError } = await supabase
            .from('products')
            .upsert({
                name: p.name,
                slug: productSlug,
                description: p.description,
                price: p.numericPrice, // numeric column
                category_id: catId,
                type: p.type, // We can store the raw type string too or link to subcategory
                is_active: true
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (prodError) {
            console.error(`Error creating product ${p.name}:`, prodError);
            continue;
        }

        // 3. Insert Variants (Sizes)
        // We treat sizes as variants. Colors are separate or combined? 
        // PRD says: product_variants (size, color).
        // Our mock product has `sizes: string[]` and we have a hardcoded color list in the UI for now.
        // Let's create a variant for each size, default color 'Default'.

        // First clear existing variants for this product to avoid duplicates if re-running
        await supabase.from('product_variants').delete().eq('product_id', prodData.id);

        const variants = p.sizes.map(size => ({
            product_id: prodData.id,
            size: size,
            color: 'Default',
            stock: 10
        }));

        const { error: variantError } = await supabase.from('product_variants').insert(variants);
        if (variantError) console.error(`Error variants for ${p.name}:`, variantError);

        // 4. Insert Images
        await supabase.from('product_images').delete().eq('product_id', prodData.id);

        const images = p.images.map((url, idx) => ({
            product_id: prodData.id,
            image_url: url,
            display_order: idx
        }));

        const { error: imgError } = await supabase.from('product_images').insert(images);
        if (imgError) console.error(`Error images for ${p.name}:`, imgError);
    }

    console.log('✅ Seeding complete!');
}

seed().catch(console.error);
