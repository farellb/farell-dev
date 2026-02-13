import { supabase } from "@/lib/supabase";

export interface ContentBlock {
    key: string;
    value: string;
}

export async function getContentBlocks(section: string): Promise<Record<string, string>> {
    const { data, error } = await supabase
        .from('content_blocks')
        .select('key, value')
        .eq('section', section)
        .eq('is_active', true);

    if (error) {
        console.error(`Error fetching content for ${section}:`, error);
        return {};
    }

    // Convert array to object: { key: value }
    return (data || []).reduce((acc: Record<string, string>, item: any) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
}
