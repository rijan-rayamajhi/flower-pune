import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/page-header";
import { getFlowerById } from "@/lib/supabase/flower-queries";
import FlowerEditForm from "./flower-edit-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function FlowerDetailPage({ params }: PageProps) {
    const { id } = await params;
    const flower = await getFlowerById(id);

    if (!flower) notFound();

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <Link href="/admin/flowers" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Flowers
                </Link>
                <PageHeader
                    title={flower.name}
                    description={`Edit flower details · /${flower.slug}`}
                />
            </div>

            <FlowerEditForm flower={flower} />
        </div>
    );
}
