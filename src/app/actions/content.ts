'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateContentBlock(id: string, value: string) {
    try {
        const { error } = await supabase
            .from('content_blocks')
            .update({ value })
            .eq('id', id);

        if (error) {
            console.error("Error updating content block:", error);
            return { success: false, error: 'Yeniləmə xətası' };
        }

        revalidatePath('/'); // Revalidate home page to show changes immediately
        revalidatePath('/admin/content');
        return { success: true };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: 'Gözlənilməz xəta' };
    }
}

export async function updateSectionOrder(order: string[]) {
    try {
        const { error } = await supabase
            .from('content_blocks')
            .upsert({
                section: 'config',
                key: 'section_order',
                value: JSON.stringify(order)
            }, { onConflict: 'section, key' });

        if (error) {
            console.error("Error updating section order:", error);
            return { success: false, error: 'Sıralama xətası' };
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Gözlənilməz xəta' };
    }
}
