import { createClient } from "@/lib/supabase/server";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminOccasion {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    subtitle: string | null;
    hero_image: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    product_count: number;
}

export interface OccasionDetail extends AdminOccasion {
    products: {
        id: string;
        name: string;
        slug: string;
        price: number;
        is_active: boolean;
        primary_image: string | null;
    }[];
}

export interface SimpleProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    is_active: boolean;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAdminOccasions(): Promise<AdminOccasion[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("occasions")
        .select("*, product_occasions(product_id)")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching occasions:", error);
        return [];
    }

    return (data || []).map((occ) => ({
        id: occ.id,
        name: occ.name,
        slug: occ.slug,
        description: occ.description,
        subtitle: occ.subtitle,
        hero_image: occ.hero_image,
        display_order: occ.display_order,
        is_active: occ.is_active,
        created_at: occ.created_at,
        product_count: Array.isArray(occ.product_occasions) ? occ.product_occasions.length : 0,
    }));
}

export async function getOccasionById(id: string): Promise<OccasionDetail | null> {
    const supabase = await createClient();

    // Get occasion
    const { data: occasion, error } = await supabase
        .from("occasions")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !occasion) {
        console.error("Error fetching occasion:", error);
        return null;
    }

    // Get assigned products via junction table
    const { data: productLinks } = await supabase
        .from("product_occasions")
        .select("product_id")
        .eq("occasion_id", id);

    const productIds = (productLinks || []).map((pl) => pl.product_id);

    let products: OccasionDetail["products"] = [];
    if (productIds.length > 0) {
        const { data: productsData } = await supabase
            .from("products")
            .select(`id, name, slug, price, is_active,
                     product_images!inner(image_url, is_primary)`)
            .in("id", productIds);

        // Fallback query without inner join in case products have no images
        if (!productsData || productsData.length === 0) {
            const { data: fallbackData } = await supabase
                .from("products")
                .select("id, name, slug, price, is_active")
                .in("id", productIds);

            products = (fallbackData || []).map((p) => ({
                ...p,
                primary_image: null,
            }));
        } else {
            products = (productsData || []).map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                is_active: p.is_active,
                primary_image: Array.isArray(p.product_images)
                    ? (p.product_images.find((img: { is_primary: boolean }) => img.is_primary)?.image_url || p.product_images[0]?.image_url || null)
                    : null,
            }));
        }
    }

    return {
        id: occasion.id,
        name: occasion.name,
        slug: occasion.slug,
        description: occasion.description,
        subtitle: occasion.subtitle,
        hero_image: occasion.hero_image,
        display_order: occasion.display_order,
        is_active: occasion.is_active,
        created_at: occasion.created_at,
        product_count: products.length,
        products,
    };
}

/**
 * Get all products NOT already assigned to an occasion (for the add product dropdown).
 */
export async function getAvailableProductsForOccasion(occasionId: string): Promise<SimpleProduct[]> {
    const supabase = await createClient();

    // Get already-assigned product IDs
    const { data: assigned } = await supabase
        .from("product_occasions")
        .select("product_id")
        .eq("occasion_id", occasionId);

    const assignedIds = (assigned || []).map((a) => a.product_id);

    // Get all active products
    let query = supabase
        .from("products")
        .select("id, name, slug, price, is_active")
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (assignedIds.length > 0) {
        // Filter out already assigned
        query = query.not("id", "in", `(${assignedIds.join(",")})`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching available products:", error);
        return [];
    }

    return (data || []) as SimpleProduct[];
}
