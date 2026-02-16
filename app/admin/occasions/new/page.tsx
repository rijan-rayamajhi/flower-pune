"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { createOccasion } from "../actions";

export default function NewOccasionPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be under 5MB");
                return;
            }
            setError(null);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        // Auto-generate slug from name if empty
        const slug = formData.get("slug") as string;
        if (!slug) {
            const name = formData.get("name") as string;
            formData.set("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
        }

        startTransition(async () => {
            const result = await createOccasion(formData);
            if (result.error) {
                setError(result.error);
            } else {
                router.push("/admin/occasions");
            }
        });
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <Link href="/admin/occasions" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Occasions
                </Link>
                <PageHeader title="New Occasion" description="Create a new occasion for your shop." />
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">Name *</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Birthday"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">Slug *</label>
                        <input
                            name="slug"
                            type="text"
                            placeholder="auto-generated from name"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Subtitle</label>
                    <input
                        name="subtitle"
                        type="text"
                        placeholder="e.g. Make their day special"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Brief description of this occasion..."
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy resize-none"
                    />
                </div>

                {/* Hero Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Hero Image</label>
                    <input
                        ref={fileInputRef}
                        name="hero_image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {/* Keep a hidden text field for existing URL fallback */}
                    <input name="hero_image" type="hidden" value="" />

                    {preview ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <div className="relative h-48 w-full">
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            </div>
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-charcoal/60 hover:text-red-500 transition-colors shadow-sm"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-burgundy/40 transition-colors p-8 flex flex-col items-center gap-2 text-charcoal/40 hover:text-charcoal/60 group"
                        >
                            <Upload className="h-8 w-8 group-hover:text-burgundy/60 transition-colors" />
                            <span className="text-sm font-medium">Click to upload hero image</span>
                            <span className="text-xs">PNG, JPG, WebP — Max 5MB</span>
                        </button>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">Display Order</label>
                        <input
                            name="display_order"
                            type="number"
                            defaultValue={0}
                            min={0}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input name="is_active" type="hidden" value="true" />
                            <input
                                type="checkbox"
                                defaultChecked
                                onChange={(e) => {
                                    const hidden = e.target.previousElementSibling as HTMLInputElement;
                                    hidden.value = e.target.checked ? "true" : "false";
                                }}
                                className="h-5 w-5 rounded border-gray-300 text-burgundy focus:ring-burgundy"
                            />
                            <span className="text-sm font-medium text-charcoal">Active</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-lg bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-burgundy/90 transition-colors disabled:opacity-60"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? "Creating..." : "Create Occasion"}
                    </button>
                </div>
            </form>
        </div>
    );
}
