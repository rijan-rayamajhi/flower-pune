import { createClient } from "@/lib/supabase/server";
import type { Occasion } from "@/lib/types/product";

/**
 * Fetch all active occasions, ordered by display_order.
 */
export async function getOccasions(): Promise<Occasion[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("occasions")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching occasions:", error);
        return [];
    }

    return (data as Occasion[]) || [];
}

/**
 * Fetch a single occasion by its slug.
 */
export async function getOccasionBySlug(
    slug: string
): Promise<Occasion | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("occasions")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) {
        console.error("Error fetching occasion:", error);
        return null;
    }

    return data as Occasion;
}
