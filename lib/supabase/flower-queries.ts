import { createClient } from "@/lib/supabase/server";

export interface AdminFlower {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    color_class: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

/**
 * Fetch all flowers for the admin list page, ordered by display_order.
 */
export async function getAdminFlowers(): Promise<AdminFlower[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("flowers")
        .select("id, name, slug, price, image_url, color_class, display_order, is_active, created_at")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getAdminFlowers] Error:", error);
        return [];
    }

    return (data as AdminFlower[]) || [];
}

/**
 * Fetch a single flower by ID.
 */
export async function getFlowerById(id: string): Promise<AdminFlower | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("flowers")
        .select("id, name, slug, price, image_url, color_class, display_order, is_active, created_at")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getFlowerById] Error:", error);
        return null;
    }

    return data as AdminFlower;
}
