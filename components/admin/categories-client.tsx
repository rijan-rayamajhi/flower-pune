"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Loader2, FolderOpen } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/actions";
import type { AdminCategory } from "@/lib/supabase/admin-queries";

interface CategoriesClientProps {
    categories: AdminCategory[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await createCategory(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setShowForm(false);
            }
        });
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingCategory) return;
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await updateCategory(editingCategory.id, formData);
            if (result.error) {
                setError(result.error);
            } else {
                setEditingCategory(null);
            }
        });
    };

    const handleDelete = (cat: AdminCategory) => {
        if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
        setError(null);
        startTransition(async () => {
            const result = await deleteCategory(cat.id);
            if (result.error) setError(result.error);
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-medium text-charcoal">Categories</h1>
                    <p className="text-charcoal/60 mt-1">Manage product categories.</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingCategory(null); setError(null); }}
                    className="btn-primary flex items-center gap-2 text-sm px-4 py-2 shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="mb-6 rounded-2xl bg-white shadow-sm border border-gray-100/50 p-6">
                    <h3 className="font-medium text-charcoal mb-4">New Category</h3>
                    <CategoryForm onSubmit={handleCreate} isPending={isPending} onCancel={() => setShowForm(false)} />
                </div>
            )}

            {/* Categories List */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100/50 overflow-hidden">
                {categories.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {categories.map((cat) => (
                            <div key={cat.id}>
                                {editingCategory?.id === cat.id ? (
                                    <div className="p-6 bg-gray-50/50">
                                        <h3 className="font-medium text-charcoal mb-4">Edit Category</h3>
                                        <CategoryForm
                                            category={cat}
                                            onSubmit={handleUpdate}
                                            isPending={isPending}
                                            onCancel={() => setEditingCategory(null)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy/5 text-burgundy">
                                                <FolderOpen className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-charcoal">{cat.name}</h3>
                                                    {!cat.is_active && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-charcoal/50">
                                                    /{cat.slug} · {cat.product_count} product{cat.product_count !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingCategory(cat); setShowForm(false); setError(null); }}
                                                className="p-2 text-charcoal/40 hover:text-burgundy hover:bg-burgundy/5 rounded-full transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat)} disabled={isPending}
                                                className="p-2 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-charcoal/40">
                        <p>No categories yet. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CategoryForm({ category, onSubmit, isPending, onCancel }: {
    category?: AdminCategory;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isPending: boolean;
    onCancel: () => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Name</label>
                    <input name="name" defaultValue={category?.name || ""} required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Slug</label>
                    <input name="slug" defaultValue={category?.slug || ""} required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Description</label>
                    <input name="description" defaultValue={category?.description || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Image URL</label>
                    <input name="image_url" defaultValue={category?.image_url || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Display Order</label>
                    <input name="display_order" type="number" min="0" defaultValue={category?.display_order ?? 0}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="is_active" value="true" defaultChecked={category?.is_active ?? true}
                        className="rounded border-gray-300" />
                    Active
                </label>
            </div>
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel}
                    className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isPending}
                    className="btn-primary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50">
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {category ? "Save Changes" : "Create Category"}
                </button>
            </div>
        </form>
    );
}
