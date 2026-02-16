import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { getAdminFlowers } from "@/lib/supabase/flower-queries";
import FlowerListActions from "./flower-list-actions";

export default async function AdminFlowersPage() {
    const flowers = await getAdminFlowers();

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <PageHeader title="Flowers" description="Manage flower types for the custom bouquet builder." />
                <Link
                    href="/admin/flowers/new"
                    className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5 shadow-sm w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Add Flower
                </Link>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50 overflow-hidden">
                {flowers.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {flowers.map((flower) => (
                            <div key={flower.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
                                {/* Image */}
                                <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                    {flower.image_url ? (
                                        <Image src={flower.image_url} alt={flower.name} fill className="object-cover" />
                                    ) : (
                                        <div className={`w-full h-full ${flower.color_class}`} />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/flowers/${flower.id}`}
                                            className="font-medium text-charcoal hover:text-burgundy transition-colors truncate"
                                        >
                                            {flower.name}
                                        </Link>
                                        {!flower.is_active && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-charcoal/50">
                                        /{flower.slug} · ₹{Number(flower.price)} per stem · Order: {flower.display_order}
                                    </p>
                                </div>

                                {/* Color swatch */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full border border-gray-200 ${flower.color_class}`} title={flower.color_class} />
                                </div>

                                {/* Actions */}
                                <FlowerListActions flower={flower} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-charcoal/40">
                        <p>No flowers yet. Add some to power the custom bouquet builder.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
