"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import { createFlower } from "../actions";

const COLOR_PRESETS = [
    { label: "Pink", value: "bg-pink-300" },
    { label: "Red", value: "bg-red-400" },
    { label: "Rose", value: "bg-rose-300" },
    { label: "White", value: "bg-white" },
    { label: "Yellow", value: "bg-yellow-300" },
    { label: "Orange", value: "bg-orange-300" },
    { label: "Purple", value: "bg-purple-400" },
    { label: "Lavender", value: "bg-purple-200" },
    { label: "Blue", value: "bg-blue-300" },
    { label: "Green", value: "bg-green-300" },
    { label: "Peach", value: "bg-orange-200" },
    { label: "Coral", value: "bg-red-300" },
];

export default function NewFlowerPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState("bg-pink-300");
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

        // Auto-generate slug
        const slug = formData.get("slug") as string;
        if (!slug) {
            const name = formData.get("name") as string;
            formData.set("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
        }

        // Add color class
        formData.set("color_class", selectedColor);

        startTransition(async () => {
            const result = await createFlower(formData);
            if (result.error) {
                setError(result.error);
            } else {
                router.push("/admin/flowers");
            }
        });
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <Link href="/admin/flowers" className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Flowers
                </Link>
                <PageHeader title="Add New Flower" description="Add a flower type for the custom bouquet builder." />
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
                            placeholder="e.g. Red Rose"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">Slug</label>
                        <input
                            name="slug"
                            type="text"
                            placeholder="auto-generated from name"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy font-mono"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Price per Stem (₹) *</label>
                    <input
                        name="price"
                        type="number"
                        required
                        min={0}
                        step={0.01}
                        placeholder="e.g. 25"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy max-w-xs"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Flower Image</label>
                    <input
                        ref={fileInputRef}
                        name="image_file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <input name="image_url" type="hidden" value="" />

                    {preview ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 w-fit">
                            <div className="relative h-40 w-40">
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
                            className="rounded-xl border-2 border-dashed border-gray-200 hover:border-burgundy/40 transition-colors p-6 flex flex-col items-center gap-2 text-charcoal/40 hover:text-charcoal/60 group"
                        >
                            <Upload className="h-6 w-6 group-hover:text-burgundy/60 transition-colors" />
                            <span className="text-sm font-medium">Upload image</span>
                            <span className="text-xs">Max 5MB</span>
                        </button>
                    )}
                </div>

                {/* Color Swatch */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Color Swatch</label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_PRESETS.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setSelectedColor(color.value)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${color.value} ${selectedColor === color.value
                                        ? 'border-burgundy scale-110 ring-2 ring-burgundy/20'
                                        : 'border-gray-200 hover:scale-105'
                                    }`}
                                title={color.label}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-charcoal/40 mt-1">Used in the bouquet summary when no image is available.</p>
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
                        {isPending ? "Creating..." : "Create Flower"}
                    </button>
                </div>
            </form>
        </div>
    );
}
