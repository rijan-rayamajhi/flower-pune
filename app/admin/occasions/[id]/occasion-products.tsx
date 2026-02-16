"use client";

import { useState, useTransition } from "react";
import { Package, Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { addProductToOccasion, removeProductFromOccasion } from "../actions";
import type { SimpleProduct, OccasionDetail } from "@/lib/supabase/occasion-queries";

interface OccasionProductsProps {
    occasionId: string;
    products: OccasionDetail["products"];
    availableProducts: SimpleProduct[];
}

export default function OccasionProducts({ occasionId, products, availableProducts }: OccasionProductsProps) {
    const [isPending, startTransition] = useTransition();
    const [selectedProductId, setSelectedProductId] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        if (!selectedProductId) return;
        setError(null);
        startTransition(async () => {
            const result = await addProductToOccasion(occasionId, selectedProductId);
            if (result.error) {
                setError(result.error);
            } else {
                setSelectedProductId("");
            }
        });
    };

    const handleRemove = (productId: string) => {
        setError(null);
        startTransition(async () => {
            const result = await removeProductFromOccasion(occasionId, productId);
            if (result.error) setError(result.error);
        });
    };

    return (
        <div className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <Package className="h-5 w-5 text-burgundy" />
                <h3 className="font-serif text-lg font-medium text-charcoal">
                    Products ({products.length})
                </h3>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg border border-red-100 mb-4">
                    {error}
                </div>
            )}

            {/* Add product */}
            <div className="flex gap-2 mb-5">
                <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-burgundy bg-white"
                >
                    <option value="">Select a product...</option>
                    {availableProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} — ₹{p.price}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAdd}
                    disabled={!selectedProductId || isPending}
                    className="inline-flex items-center gap-1 rounded-lg bg-burgundy px-3 py-2 text-sm font-medium text-white hover:bg-burgundy/90 transition-colors disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add
                </button>
            </div>

            {/* Product list */}
            {products.length > 0 ? (
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="relative h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {product.primary_image ? (
                                    <Image src={product.primary_image} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full text-charcoal/20">
                                        <Package className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                                <p className="text-xs text-charcoal/40">₹{Number(product.price).toLocaleString("en-IN")}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(product.id)}
                                disabled={isPending}
                                className="text-charcoal/30 hover:text-red-500 transition-colors disabled:opacity-50 shrink-0"
                                title="Remove from occasion"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-charcoal/30 text-sm">
                    <Package className="h-8 w-8 mx-auto mb-2 text-charcoal/15" />
                    <p>No products assigned yet.</p>
                    <p className="text-xs mt-1">Use the dropdown above to add products.</p>
                </div>
            )}
        </div>
    );
}
