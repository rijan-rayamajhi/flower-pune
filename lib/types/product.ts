// ─── Supabase Product Types ──────────────────────────────────────────────────

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    display_order: number;
}

export interface Occasion {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    subtitle: string | null;
    hero_image: string | null;
    display_order: number;
}

export interface Flower {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    color_class: string;
    display_order: number;
}

export interface ProductImage {
    id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    is_primary: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    compare_at_price: number | null;
    sku: string | null;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    category_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined relations
    categories: Category | null;
    product_images: ProductImage[];
    product_occasions: { occasions: Occasion }[];
}

/** Minimal shape for rendering ProductCard components */
export interface ProductCardData {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    href: string;
    occasions?: string[];
    stockQuantity: number;
}

/** Convert a full Product to ProductCardData */
export function toProductCardData(product: Product): ProductCardData {
    const primaryImage = product.product_images?.find((img) => img.is_primary);
    const firstImage = product.product_images?.[0];

    return {
        id: product.id,
        title: product.name,
        price: Number(product.price),
        image:
            primaryImage?.image_url ||
            firstImage?.image_url ||
            "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
        category: product.categories?.name,
        href: `/product/${product.id}`,
        occasions: product.product_occasions?.map((po) => po.occasions.slug) || [],
        stockQuantity: product.stock_quantity ?? 0,
    };
}

/** Filter & sort parameters for product queries */
export interface ProductFilters {
    categories?: string[];
    occasions?: string[];
    priceMin?: number;
    priceMax?: number;
    search?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    limit?: number;
    featuredOnly?: boolean;
}
