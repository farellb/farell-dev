import { supabase } from "@/lib/supabase";
import { SectionSortableList } from "@/components/admin/SectionSortableList";

export const revalidate = 0;

export default async function AdminContentPage() {
    const { data: blocks, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('section', { ascending: true })
        .order('key', { ascending: true });

    if (error) {
        return <div className="p-4 text-red-500">Xəta baş verdi: {error.message}</div>;
    }

    // Extract section order config
    const configBlock = blocks.find(b => b.section === 'config' && b.key === 'section_order');
    let sectionOrder: string[] = ["hero", "marquee", "vision", "philosophy", "store", "category_grid"]; // Default order

    if (configBlock && configBlock.value) {
        try {
            const storedOrder = JSON.parse(configBlock.value);
            if (Array.isArray(storedOrder)) {
                sectionOrder = storedOrder;
                // Ensure category_grid is in the list if not present
                if (!sectionOrder.includes('category_grid')) {
                    sectionOrder.push('category_grid');
                }
            }
        } catch (e) {
            console.error("Failed to parse section order", e);
        }
    }

    // Filter out config blocks from display
    const contentBlocks = blocks.filter(b => b.section !== 'config');

    // Group by section
    const groupedBlocks = contentBlocks.reduce((acc: Record<string, any[]>, block) => {
        if (!acc[block.section]) acc[block.section] = [];
        acc[block.section].push(block);
        return acc;
    }, {});

    // Ensure all sections in order exist in groupedBlocks (even if empty) to be sortable
    sectionOrder.forEach(section => {
        if (!groupedBlocks[section]) {
            groupedBlocks[section] = [];
        }
    });

    // Add any sections found in blocks but not in order to the end
    Object.keys(groupedBlocks).forEach(section => {
        if (!sectionOrder.includes(section)) {
            sectionOrder.push(section);
        }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-6">Məzmun İdarəetməsi</h1>
            <SectionSortableList initialOrder={sectionOrder} groupedBlocks={groupedBlocks} />
        </div>
    );
}
