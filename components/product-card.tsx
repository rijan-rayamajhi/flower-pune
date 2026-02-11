"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    href?: string;
}

export default function ProductCard({
    id,
    title,
    price,
    image,
    category,
    href = `/product/${id}`,
}: ProductCardProps) {
    const { openCart } = useCart();

    return (
        <div className="group relative block h-full">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
                <Link href={href}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                </Link>

                {/* Wishlist Button */}
                <button
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-burgundy text-charcoal/60"
                    aria-label="Add to wishlist"
                >
                    <Heart className="h-5 w-5" />
                </button>

                {/* Add to Cart Button (Hover Reveal) */}
                <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                        onClick={openCart}
                        className="w-full rounded-sm bg-white/90 py-3 text-sm font-medium text-charcoal backdrop-blur-md shadow-lg transition-colors hover:bg-burgundy hover:text-white flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="mt-4 flex flex-col gap-1">
                {category && (
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
                        {category}
                    </p>
                )}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium text-charcoal">
                        <Link href={href} className="transition-colors hover:text-burgundy">
                            {title}
                        </Link>
                    </h3>
                    <p className="font-bold text-charcoal shrink-0">
                        ${price}
                    </p>
                </div>
            </div>
        </div>
    );
}
