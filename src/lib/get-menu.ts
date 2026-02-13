import { supabase } from '@/lib/supabase';
import { MenuCategory, SubCategory } from '@/lib/menu-data';

export async function getMenuData(): Promise<MenuCategory[]> {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug, parent_id, image_url')
            .order('name');

        if (error || !categories) {
            console.error('Error fetching menu:', error);
            return [];
        }

        // 1. Identify Root Categories
        const rootCategories = categories.filter(c => !c.parent_id);

        // Custom Sort Order: Men, Women, Kids, Accessories
        const sortOrder = ['men', 'women', 'kids', 'accessories'];
        rootCategories.sort((a, b) => {
            const indexA = sortOrder.indexOf(a.slug);
            const indexB = sortOrder.indexOf(b.slug);
            // If both are in the list, sort by index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only A is in list, A comes first
            if (indexA !== -1) return -1;
            // If only B is in list, B comes first
            if (indexB !== -1) return 1;
            // Otherwise sort alphabetically
            return a.name.localeCompare(b.name);
        });

        const menu: MenuCategory[] = [];

        for (const root of rootCategories) {
            const children = categories.filter(c => c.parent_id === root.id);
            const subcategories: SubCategory[] = [];

            // 2. Identify Groups vs Items among children
            // A child is a "Group" if it has its own children (Grandchildren of Root)
            // A child is an "Item" if it has NO children.

            const groupNodes: any[] = [];
            const leafNodes: any[] = [];

            children.forEach(child => {
                const grandChildren = categories.filter(gc => gc.parent_id === child.id);
                if (grandChildren.length > 0) {
                    groupNodes.push({ node: child, kids: grandChildren });
                } else {
                    leafNodes.push(child);
                }
            });

            // 3. Add Groups (Subcategories with Titles)
            groupNodes.forEach(group => {
                subcategories.push({
                    title: group.node.name,
                    items: group.kids.map((kid: any) => ({
                        label: kid.name,
                        href: `/shop?category=${root.slug}&type=${kid.slug}`
                    }))
                });
            });

            // 4. Add Direct Items (Subcategories without Titles)
            if (leafNodes.length > 0) {
                subcategories.push({
                    title: "", // Empty title for mixed items
                    items: leafNodes.map(leaf => ({
                        label: leaf.name,
                        href: `/shop?category=${root.slug}&type=${leaf.slug}`
                    }))
                });
            }

            // 5. Ensure "General" links exist
            // If we have no groups and no items, we still want the category to appear
            // Add "Hamısına bax" to the first group (or create one)
            if (subcategories.length === 0) {
                subcategories.push({
                    title: "",
                    items: []
                });
            }

            // Add "Hamısına bax" and "Yeni Gələnlər" to the first text-less group, or create one
            let defaultGroup = subcategories.find(s => s.title === "");
            if (!defaultGroup) {
                defaultGroup = { title: "", items: [] };
                subcategories.unshift(defaultGroup);
            }

            // Prepend standard links
            defaultGroup.items.unshift(
                { label: 'Hamısına bax', href: `/shop?category=${root.slug}` },
                { label: 'Yeni Gələnlər', href: `/shop?category=${root.slug}&sort=new` }
            );

            menu.push({
                label: root.name,
                href: `/shop?category=${root.slug}`,
                subcategories,
                featuredImage: root.image_url || undefined
            });
        }

        return menu;
    } catch (e) {
        console.error("Exception fetching menu", e);
        return [];
    }
}
