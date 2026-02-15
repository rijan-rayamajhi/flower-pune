"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    href?: string;
}

import { motion } from "framer-motion";

// ... existing imports

export default function ProductCard({
    id,
    title,
    price,
    image,
    category,
    href = `/product/${id}`,
}: ProductCardProps) {
    const { openCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isWishlisted = mounted && isInWishlist(id);

    return (
        <motion.div
            className="group relative block h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
                <Link href={href}>
                    <motion.div
                        className="h-full w-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    </motion.div>
                </Link>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (isInWishlist(id)) {
                            removeFromWishlist(id);
                        } else {
                            addToWishlist({ id, title, price, image, category, href });
                        }
                    }}
                    className={`absolute right-2 top-2 sm:right-4 sm:top-4 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-burgundy ${isWishlisted ? "bg-white text-burgundy" : "bg-white/80 text-charcoal/60"
                        }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Add to Cart Button (Hover Reveal) */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-10 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openCart}
                        className="w-full rounded-sm bg-white/90 py-2 sm:py-3 text-xs sm:text-sm font-medium text-charcoal backdrop-blur-md shadow-lg transition-colors hover:bg-burgundy hover:text-white flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                    </motion.button>
                </div>
            </div>

            {/* Details */}
            <div className="mt-2 sm:mt-4 flex flex-col gap-0.5 sm:gap-1">
                {category && (
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
                        {category}
                    </p>
                )}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-charcoal line-clamp-1">
                        <Link href={href} className="transition-colors hover:text-burgundy">
                            {title}
                        </Link>
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-charcoal shrink-0">
                        ${price}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
