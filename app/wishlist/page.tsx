"use client";

import { motion } from "framer-motion";
import { useWishlist } from "@/context/wishlist-context";
import WishlistProductCard from "@/components/wishlist-product-card";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function WishlistPage() {
    const { items } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <main className="min-h-screen bg-ivory pb-20 pt-8">
                <div className="container-page">
                    <header className="mb-8 sm:mb-12 text-center">
                        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl lg:text-5xl">
                            Saved Blooms
                        </h1>
                    </header>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-ivory pb-20 pt-8">
            <div className="container-page">
                <header className="mb-8 sm:mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl lg:text-5xl"
                    >
                        Saved Blooms
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-4 h-[1px] w-16 bg-burgundy/20"
                    />
                </header>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 gap-y-6 sm:gap-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <WishlistProductCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="mb-6 h-24 w-24 rounded-full bg-blush/30 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-10 w-10 text-burgundy/50"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </div>
                        <h2 className="mb-2 font-serif text-2xl text-charcoal">
                            Your wishlist is empty
                        </h2>
                        <p className="mb-8 max-w-md text-charcoal/60">
                            Save your favorite floral arrangements to revisit them later.
                            Start exploring our collection today.
                        </p>
                        <Link
                            href="/shop"
                            className="btn-primary"
                        >
                            Explore Shop
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
