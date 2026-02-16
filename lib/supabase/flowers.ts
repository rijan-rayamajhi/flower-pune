import { createClient } from "@/lib/supabase/server";
import type { Flower } from "@/lib/types/product";

/**
 * Fetch all active flowers for the custom bouquet builder, ordered by display_order.
 */
export async function getFlowers(): Promise<Flower[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("flowers")
        .select("id, name, slug, price, image_url, color_class, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    if (error) {
        // Table may not exist yet — warn instead of error to avoid dev overlay noise
        console.warn("[flowers] Supabase:", error.message || error.code || "unknown error");
        return [];
    }

    return (data as Flower[]) || [];
}
