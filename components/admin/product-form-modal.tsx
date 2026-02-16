"use client";

import { useState, useTransition, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/app/admin/actions";
import type { Product, Category } from "@/lib/types/product";

interface ProductFormModalProps {
    product?: Product | null;
    categories: Category[];
    onClose: () => void;
}

export default function ProductFormModal({ product, categories, onClose }: ProductFormModalProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isEditing = !!product;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setWarning(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = isEditing
                ? await updateProduct(product!.id, formData)
                : await createProduct(formData);

            if (result.error) {
                setError(result.error);
            } else if (result.warning) {
                setWarning(result.warning);
            } else {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-serif text-xl font-medium text-charcoal">
                        {isEditing ? "Edit Product" : "Add Product"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-charcoal/60" />
                    </button>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {warning && (
                        <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-100">
                            {warning}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Name</label>
                            <input name="name" defaultValue={product?.name || ""} required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Slug</label>
                            <input name="slug" defaultValue={product?.slug || ""} required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Price (₹)</label>
                            <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price || ""} required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Compare Price</label>
                            <input name="compare_at_price" type="number" step="0.01" min="0" defaultValue={product?.compare_at_price || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Stock</label>
                            <input name="stock_quantity" type="number" min="0" defaultValue={product?.stock_quantity ?? 0} required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">SKU</label>
                            <input name="sku" defaultValue={product?.sku || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Category</label>
                            <select name="category_id" defaultValue={product?.category_id || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy bg-white">
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Description</label>
                            <textarea name="description" rows={3} defaultValue={product?.description || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy resize-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Short Description</label>
                            <input name="short_description" defaultValue={product?.short_description || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="hidden" name="is_active" value="false" />
                            <input type="checkbox" name="is_active" value="true" defaultChecked={product?.is_active ?? true}
                                className="rounded border-gray-300" />
                            Active
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="hidden" name="is_featured" value="false" />
                            <input type="checkbox" name="is_featured" value="true" defaultChecked={product?.is_featured ?? false}
                                className="rounded border-gray-300" />
                            Featured
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-charcoal/70 mb-1">
                            {isEditing ? "Replace Image" : "Product Image"}
                        </label>
                        <div className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg">
                            <Upload className="h-5 w-5 text-charcoal/40" />
                            <input type="file" name="image" accept="image/*"
                                className="text-sm text-charcoal/60 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-burgundy/5 file:text-burgundy hover:file:bg-burgundy/10" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending}
                            className="btn-primary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50">
                            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditing ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
