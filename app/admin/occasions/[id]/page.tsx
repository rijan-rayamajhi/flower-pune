import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/page-header";
import { getOccasionById, getAvailableProductsForOccasion } from "@/lib/supabase/occasion-queries";
import OccasionEditForm from "./occasion-edit-form";
import OccasionProducts from "./occasion-products";

interface OccasionDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OccasionDetailPage({ params }: OccasionDetailPageProps) {
    const { id } = await params;
    const occasion = await getOccasionById(id);

    if (!occasion) {
        notFound();
    }

    const availableProducts = await getAvailableProductsForOccasion(id);

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <Link href="/admin/occasions" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Occasions
                </Link>
                <PageHeader
                    title={occasion.name}
                    description={`Manage occasion details and assign products.`}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Edit Form (3 cols) */}
                <div className="lg:col-span-3">
                    <OccasionEditForm occasion={occasion} />
                </div>

                {/* Products Panel (2 cols) */}
                <div className="lg:col-span-2">
                    <OccasionProducts
                        occasionId={occasion.id}
                        products={occasion.products}
                        availableProducts={availableProducts}
                    />
                </div>
            </div>
        </div>
    );
}
