import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { cn } from "@/lib/utils";
import { getAdminOccasions } from "@/lib/supabase/occasion-queries";
import OccasionListActions from "./occasion-list-actions";

export default async function OccasionsPage() {
    const occasions = await getAdminOccasions();

    return (
        <div>
            <PageHeader
                title="Occasions"
                description={`${occasions.length} occasion${occasions.length !== 1 ? "s" : ""}`}
                action={
                    <Link
                        href="/admin/occasions/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-burgundy px-4 py-2.5 text-sm font-medium text-white hover:bg-burgundy/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Occasion
                    </Link>
                }
            />

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50">
                {occasions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-charcoal/60">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Slug</th>
                                    <th className="px-6 py-4 font-medium">Products</th>
                                    <th className="px-6 py-4 font-medium">Order</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {occasions.map((occ) => (
                                    <tr key={occ.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/occasions/${occ.id}`} className="font-medium text-burgundy hover:underline">
                                                {occ.name}
                                            </Link>
                                            {occ.subtitle && (
                                                <p className="text-xs text-charcoal/40 mt-0.5">{occ.subtitle}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/50 font-mono text-xs">{occ.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-medium">
                                                {occ.product_count} product{occ.product_count !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/60">{occ.display_order}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                occ.is_active
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-gray-50 text-gray-500 border-gray-200"
                                            )}>
                                                {occ.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <OccasionListActions occasionId={occ.id} isActive={occ.is_active} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-charcoal/40">
                        <p>No occasions yet. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
