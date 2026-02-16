import { createClient } from "@/lib/supabase/server";
import type { Product, ProductFilters } from "@/lib/types/product";

// ─── Base select for products with all joins ────────────────────────────────
const PRODUCT_SELECT = `
  *,
  categories (*),
  product_images (*),
  product_occasions (
    occasions (*)
  )
`;

/**
 * Fetch products with optional filtering, sorting, and search.
 * Only returns is_active = true products (also enforced by RLS).
 */
export async function getProducts(
    filters: ProductFilters = {}
): Promise<Product[]> {
    const supabase = await createClient();

    let query = supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("is_active", true);

    // Search (ILIKE on name and description)
    if (filters.search) {
        query = query.or(
            `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
    }

    // Category filter (by slug)
    if (filters.categories && filters.categories.length > 0) {
        // We need to filter by category slug — get the category IDs first via a sub-approach
        // Actually, we can use the foreign table filter
        query = query.in("categories.slug", filters.categories);
    }

    // Price range
    if (filters.priceMin !== undefined) {
        query = query.gte("price", filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
        query = query.lt("price", filters.priceMax);
    }

    // Featured only
    if (filters.featuredOnly) {
        query = query.eq("is_featured", true);
    }

    // Sorting
    switch (filters.sort) {
        case "price-asc":
            query = query.order("price", { ascending: true });
            break;
        case "price-desc":
            query = query.order("price", { ascending: false });
            break;
        case "newest":
        default:
            query = query.order("created_at", { ascending: false });
            break;
    }

    // Limit
    if (filters.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    // If category filter was applied via foreign table, Supabase returns rows with
    // null categories for non-matching rows. Filter them out client-side.
    let products = (data as Product[]) || [];
    if (filters.categories && filters.categories.length > 0) {
        products = products.filter((p) => p.categories !== null);
    }

    // If occasion filter was applied, filter client-side on the joined data
    if (filters.occasions && filters.occasions.length > 0) {
        products = products.filter((p) =>
            p.product_occasions?.some((po) =>
                filters.occasions!.includes(po.occasions.slug)
            )
        );
    }

    return products;
}

/**
 * Fetch a single product by its UUID, with all joined data.
 */
export async function getProductById(
    id: string
): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }

    return data as Product;
}

/**
 * Fetch a single product by its slug, with all joined data.
 */
export async function getProductBySlug(
    slug: string
): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }

    return data as Product;
}

/**
 * Fetch featured products (is_featured = true).
 */
export async function getFeaturedProducts(
    limit: number = 4
): Promise<Product[]> {
    return getProducts({ featuredOnly: true, limit, sort: "newest" });
}

/**
 * Fetch products linked to a specific occasion slug.
 */
export async function getProductsByOccasion(
    occasionSlug: string
): Promise<Product[]> {
    const supabase = await createClient();

    // Query products that have a matching occasion via the junction table
    const { data, error } = await supabase
        .from("products")
        .select(
            `
      *,
      categories (*),
      product_images (*),
      product_occasions!inner (
        occasions!inner (*)
      )
    `
        )
        .eq("is_active", true)
        .eq("product_occasions.occasions.slug", occasionSlug)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products by occasion:", error);
        return [];
    }

    return (data as Product[]) || [];
}

/**
 * Search products by name or description using ILIKE.
 */
export async function searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    return getProducts({ search: query, limit: 20 });
}

/**
 * Fetch all products for admin (includes inactive).
 */
export async function getAdminProducts(): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin products:", error);
        return [];
    }

    return (data as Product[]) || [];
}
