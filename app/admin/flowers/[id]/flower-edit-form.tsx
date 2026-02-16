"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Save, Loader2, Upload, X } from "lucide-react";
import { updateFlower } from "../actions";
import type { AdminFlower } from "@/lib/supabase/flower-queries";

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

export default function FlowerEditForm({ flower }: { flower: AdminFlower }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [preview, setPreview] = useState<string | null>(flower.image_url || null);
    const [hasNewFile, setHasNewFile] = useState(false);
    const [selectedColor, setSelectedColor] = useState(flower.color_class || "bg-pink-300");
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

        // Pass existing URL if no new file
        if (!hasNewFile && preview) {
            formData.set("image_url", preview);
        }

        // Add color class
        formData.set("color_class", selectedColor);

        startTransition(async () => {
            const result = await updateFlower(flower.id, formData);
            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: "Flower updated!" });
                setHasNewFile(false);
                setTimeout(() => setMessage(null), 3000);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 border border-gray-100/50 shadow-sm space-y-5">
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
                        defaultValue={flower.name}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Slug *</label>
                    <input
                        name="slug"
                        type="text"
                        required
                        defaultValue={flower.slug}
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
                    defaultValue={Number(flower.price)}
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
                <input name="image_url" type="hidden" value={hasNewFile ? "" : (preview || "")} />

                {preview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 w-fit">
                        <div className="relative h-40 w-40">
                            <Image src={preview} alt="Flower preview" fill className="object-cover" unoptimized />
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
                        defaultValue={flower.display_order}
                        min={0}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy"
                    />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input name="is_active" type="hidden" value={flower.is_active ? "true" : "false"} />
                        <input
                            type="checkbox"
                            defaultChecked={flower.is_active}
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
