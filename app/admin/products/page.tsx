import { getAdminProducts } from "@/lib/supabase/products";
import { getAdminCategories } from "@/lib/supabase/admin-queries";
import ProductsGrid from "@/components/admin/products-grid";

export default async function ProductsPage() {
    const [products, categoriesRaw] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
    ]);

    // Map to simple Category type for the modal
    const categories = categoriesRaw.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image_url: c.image_url,
        display_order: c.display_order,
    }));

    return <ProductsGrid products={products} categories={categories} />;
}
