"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/product-card";
import FilterOverlay from "@/components/shop/filter-overlay";
import SortDropdown, { SortOption } from "@/components/shop/sort-dropdown";

// Mock Data with Working Images
const PRODUCTS = [
    {
        id: "1",
        title: "Eternal Red Roses",
        price: 129,
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
        category: "Roses",
    },
    {
        id: "2",
        title: "Champagne Peonies",
        price: 159,
        image: "https://images.unsplash.com/photo-1712258091779-48b46ad77437?q=80&w=800&auto=format&fit=crop",
        category: "Peonies",
    },
    {
        id: "3",
        title: "Ivory Orchids",
        price: 189,
        image: "https://images.unsplash.com/photo-1687299443525-96f91e129053?q=80&w=800&auto=format&fit=crop",
        category: "Orchids",
    },
    {
        id: "4",
        title: "Blush Garden Roses",
        price: 145,
        image: "https://images.unsplash.com/photo-1547848803-2937f52e76f5?q=80&w=800&auto=format&fit=crop",
        category: "Roses",
    },
    {
        id: "5",
        title: "Burgundy Tulips",
        price: 99,
        image: "https://plus.unsplash.com/premium_photo-1661308363998-56016ff5843a?q=80&w=800&auto=format&fit=crop",
        category: "Tulips",
    },
    {
        id: "6",
        title: "Whispering Lilies",
        price: 110,
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
        category: "Lilies",
    },
    {
        id: "7",
        title: "Golden Hour Bouquet",
        price: 210,
        image: "https://images.unsplash.com/photo-1712258091779-48b46ad77437?q=80&w=800&auto=format&fit=crop",
        category: "Bouquets",
    },
    {
        id: "8",
        title: "Midnight Orchid",
        price: 250,
        image: "https://images.unsplash.com/photo-1687299443525-96f91e129053?q=80&w=800&auto=format&fit=crop",
        category: "Orchids",
    },
    {
        id: "9",
        title: "Summer Breeze",
        price: 135,
        image: "https://plus.unsplash.com/premium_photo-1661308363998-56016ff5843a?q=80&w=800&auto=format&fit=crop",
        category: "Bouquets",
    },
];

export default function ShopPage() {
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Sort Logic
    const sortedProducts = [...PRODUCTS].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // Default to original order (Newest mock)
    });

    return (
        <main className="min-h-screen bg-ivory pb-20 pt-32">
            <FilterOverlay isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

            <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                {/* Header */}
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-serif text-5xl text-charcoal md:text-6xl lg:text-7xl"
                    >
                        Shop All Blooms
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="mx-auto mt-6 h-[1px] w-24 bg-champagne"
                    />
                </header>

                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="sticky top-[72px] z-30 mb-12 flex flex-col items-center justify-between gap-4 border-b border-burgundy/10 bg-ivory/80 pb-4 backdrop-blur-md md:flex-row md:pb-6"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="group flex items-center gap-2 rounded-full border border-burgundy/20 px-4 py-2 text-sm font-medium text-charcoal transition-all hover:bg-burgundy hover:text-white hover:shadow-luxury"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                        <span className="text-sm text-charcoal/60">
                            Showing {sortedProducts.length} results
                        </span>
                    </div>

                    <div className="flex items-center gap-2 z-40">
                        <SortDropdown value={sortBy} onChange={setSortBy} />
                    </div>
                </motion.div>

                {/* Product Grid */}
                {sortedProducts.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                    >
                        <AnimatePresence>
                            {sortedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex min-h-[400px] flex-col items-center justify-center text-center"
                    >
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/5 text-burgundy">
                            <ArrowUpDown className="h-8 w-8 opacity-50" />
                        </div>
                        <h3 className="mb-2 font-serif text-2xl text-charcoal">
                            No blooms found
                        </h3>
                        <p className="max-w-md text-charcoal/60">
                            Try adjusting your filters or checking back later for our new collection.
                        </p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
