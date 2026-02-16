import { getAdminCategories } from "@/lib/supabase/admin-queries";
import CategoriesClient from "@/components/admin/categories-client";

export default async function CategoriesPage() {
    const categories = await getAdminCategories();
    return <CategoriesClient categories={categories} />;
}
