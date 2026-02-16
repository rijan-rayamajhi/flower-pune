"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Save, Loader2, Upload, X } from "lucide-react";
import { updateOccasion } from "../actions";
import type { OccasionDetail } from "@/lib/supabase/occasion-queries";

export default function OccasionEditForm({ occasion }: { occasion: OccasionDetail }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [preview, setPreview] = useState<string | null>(occasion.hero_image || null);
    const [hasNewFile, setHasNewFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setMessage({ type: "error", text: "Please select a valid image file" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: "error", text: "Image must be under 5MB" });
                return;
            }
            setMessage(null);
            setHasNewFile(true);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        setHasNewFile(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        const formData = new FormData(e.currentTarget);

        // If no new file was selected, pass the existing URL
        if (!hasNewFile && preview) {
            formData.set("hero_image", preview);
        }

        startTransition(async () => {
            const result = await updateOccasion(occasion.id, formData);
            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: "Occasion updated!" });
                setHasNewFile(false);
                setTimeout(() => setMessage(null), 3000);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-medium text-charcoal">Details</h3>

            {message && (
                <div className={`text-sm px-4 py-3 rounded-lg border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Name *</label>
                    <input
                        name="name"
                        type="text"
                        required
                        defaultValue={occasion.name}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Slug *</label>
                    <input
                        name="slug"
                        type="text"
                        required
                        defaultValue={occasion.slug}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy font-mono"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Subtitle</label>
                <input
                    name="subtitle"
                    type="text"
                    defaultValue={occasion.subtitle || ""}
                    placeholder="e.g. Make their day special"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={occasion.description || ""}
                    placeholder="Brief description..."
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
                {/* Hidden field for existing URL */}
                <input name="hero_image" type="hidden" value={hasNewFile ? "" : (preview || "")} />

                {preview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <div className="relative h-48 w-full">
                            <Image src={preview} alt="Hero preview" fill className="object-cover" unoptimized />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1.5">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-charcoal/60 hover:text-burgundy transition-colors shadow-sm"
                                title="Change image"
                            >
                                <Upload className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={clearImage}
                                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-charcoal/60 hover:text-red-500 transition-colors shadow-sm"
                                title="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
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
                        defaultValue={occasion.display_order}
                        min={0}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                    />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input name="is_active" type="hidden" value={occasion.is_active ? "true" : "false"} />
                        <input
                            type="checkbox"
                            defaultChecked={occasion.is_active}
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
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
