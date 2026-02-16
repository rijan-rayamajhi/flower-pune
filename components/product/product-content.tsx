"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Star, Check, Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface ProductImage {
    id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    is_primary: boolean;
}

interface ProductContentProps {
    product: {
        id: string;
        name: string;
        price: number;
        compare_at_price?: number | null;
        description: string | null;
        short_description: string | null;
        images: ProductImage[];
        category?: string | null;
        details?: string[];
    };
}

export default function ProductContent({ product }: ProductContentProps) {
    const { openCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [addons, setAddons] = useState<string[]>([]);

    const images = product.images.length > 0
        ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
        : ["https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=1200&auto=format&fit=crop"];

    const handleAddToCart = () => {
        openCart();
    };

    const toggleAddon = (addon: string) => {
        if (addons.includes(addon)) {
            setAddons(addons.filter((a) => a !== addon));
        } else {
            setAddons([...addons, addon]);
        }
    };

    const details = product.details || [
        "Hand-tied bouquet",
        "Premium quality stems",
        "Vase life: 7-10 days"
    ];

    return (
        <div className="bg-ivory pb-24 lg:pb-0">
            <div className="mx-auto max-w-[1440px] px-0 lg:px-8 lg:py-12">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12">

                    {/* Left: Gallery (60%) */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col-reverse gap-4 lg:flex-row">
                            {/* Thumbnails */}
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-0 lg:pb-0 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={cn(
                                            "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all lg:h-24 lg:w-24",
                                            activeImage === idx ? "border-burgundy" : "border-transparent opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="relative aspect-[3/4] sm:aspect-[3/4] w-full overflow-hidden bg-gray-100 lg:rounded-2xl">
                                <Image
                                    src={images[activeImage]}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details (40%) - Sticky on Desktop */}
                    <div className="px-4 lg:col-span-5 lg:px-0">
                        <div className="sticky top-24 flex flex-col gap-5 sm:gap-8">

                            {/* Header */}
                            <div className="border-b border-burgundy/10 pb-4 sm:pb-6">
                                <div className="flex items-start justify-between">
                                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-charcoal lg:text-5xl">{product.name}</h1>
                                    <button className="rounded-full bg-white p-3 text-charcoal/60 hover:text-burgundy transition-colors shadow-sm border border-gray-100">
                                        <Heart className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="mt-4 flex items-baseline gap-4">
                                    <span className="text-2xl font-bold text-charcoal">₹{product.price}</span>
                                    {product.compare_at_price && (
                                        <span className="text-lg text-charcoal/40 line-through">₹{product.compare_at_price}</span>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-charcoal/60">
                                        <Star className="h-4 w-4 fill-burgundy text-burgundy" />
                                        <span className="font-medium text-charcoal">4.9</span>
                                        <span>(128 reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="font-serif text-base sm:text-lg leading-relaxed text-charcoal/80 italic">
                                    &quot;{product.description || "A beautifully crafted arrangement for every occasion."}&quot;
                                </p>
                                <ul className="mt-6 space-y-2">
                                    {details.map((detail, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-charcoal/70">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/20">
                                                <Check className="h-3 w-3 text-sage" />
                                            </span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Personalization */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium uppercase tracking-wider text-charcoal/60">
                                    Gift Message (Optional)
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-none bg-gray-50 p-4 text-charcoal placeholder:text-charcoal/30 focus:ring-1 focus:ring-burgundy"
                                    rows={3}
                                    placeholder="Write your message here..."
                                />
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium uppercase tracking-wider text-charcoal/60">
                                    Complete the Gift
                                </label>
                                {[
                                    { id: "vase", name: "Glass Vase", price: 20 },
                                    { id: "chocs", name: "Artisan Chocolates", price: 15 }
                                ].map((addon) => (
                                    <div
                                        key={addon.id}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={cn(
                                            "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all",
                                            addons.includes(addon.id)
                                                ? "border-burgundy bg-burgundy/5"
                                                : "border-gray-200 hover:border-burgundy/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                                                addons.includes(addon.id) ? "border-burgundy bg-burgundy" : "border-gray-300"
                                            )}>
                                                {addons.includes(addon.id) && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <span className="font-medium text-charcoal">{addon.name}</span>
                                        </div>
                                        <span className="text-charcoal/60">+₹{addon.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions (Desktop) */}
                            <div className="hidden flex-col gap-4 pt-4 lg:flex">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 items-center rounded-sm border border-gray-200 bg-white">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-full px-4 text-charcoal/60 hover:text-charcoal"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="h-full px-4 text-charcoal/60 hover:text-charcoal"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="btn-primary h-14 flex-1 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Add to Cart - ₹{(product.price * quantity) + addons.length * 15}
                                    </button>
                                </div>
                                <button className="h-14 w-full rounded-sm border border-charcoal/10 font-medium text-charcoal hover:bg-gray-50 transition-colors">
                                    Buy Now
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white p-4 shadow-top lg:hidden">
                <div className="flex gap-4">
                    <div className="flex h-12 w-28 items-center justify-center rounded-sm bg-gray-50">
                        <span className="text-sm font-medium text-charcoal/60 mr-2">Qty:</span>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="bg-transparent font-bold text-charcoal focus:outline-none"
                        >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="btn-primary h-12 flex-1 text-sm shadow-md"
                    >
                        Add to Cart - ₹{(product.price * quantity) + addons.length * 15}
                    </button>
                </div>
            </div>

        </div>
    );
}
