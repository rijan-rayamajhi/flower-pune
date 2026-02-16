"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/product-card";
import FilterOverlay, { FilterState } from "@/components/shop/filter-overlay";
import SortDropdown, { SortOption } from "@/components/shop/sort-dropdown";
import type { ProductCardData } from "@/lib/types/product";

const INITIAL_FILTERS: FilterState = {
    categories: [],
    occasions: [],
    priceRange: "All"
};

interface ShopContentProps {
    products: ProductCardData[];
}

export default function ShopContent({ products }: ShopContentProps) {
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Active filters applied to the list
    const [activeFilters, setActiveFilters] = useState<FilterState>(INITIAL_FILTERS);

    // Temporary filters for the overlay (applied only when "Apply" is clicked)
    const [tempFilters, setTempFilters] = useState<FilterState>(INITIAL_FILTERS);

    // Clear filters handler
    const handleClearFilters = () => {
        setTempFilters(INITIAL_FILTERS);
    };

    // Open filters handler
    const handleOpenFilters = () => {
        setTempFilters(activeFilters);
        setIsFilterOpen(true);
    };

    // Apply filters handler
    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
        setIsFilterOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Derived state: Filtered products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Category Filter
            if (activeFilters.categories.length > 0) {
                if (!product.category || !activeFilters.categories.includes(product.category)) {
                    return false;
                }
            }

            // Occasion Filter
            if (activeFilters.occasions.length > 0) {
                const normalizeOccasion = (occ: string) => {
                    if (occ === "Mother's Day") return "mother-day";
                    return occ.toLowerCase().replace(/\s+/g, "-");
                };

                const normalizedFilterOccasions = activeFilters.occasions.map(normalizeOccasion);
                const productOccasions = product.occasions || [];

                const matchesOccasion = productOccasions.some(occ => normalizedFilterOccasions.includes(occ));

                if (!matchesOccasion) return false;
            }

            // Price Filter
            if (activeFilters.priceRange !== "All") {
                const price = product.price;
                switch (activeFilters.priceRange) {
                    case "$0 - $50":
                        if (price >= 50) return false;
                        break;
                    case "$50 - $100":
                        if (price < 50 || price >= 100) return false;
                        break;
                    case "$100 - $200":
                        if (price < 100 || price >= 200) return false;
                        break;
                    case "$200+":
                        if (price < 200) return false;
                        break;
                }
            }

            return true;
        });
    }, [activeFilters, products]);

    // Derived state: Sorted products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            return 0; // "newest" — server already ordered by created_at desc
        });
    }, [filteredProducts, sortBy]);

    // Count active filters for badge
    const activeFilterCount =
        activeFilters.categories.length +
        activeFilters.occasions.length +
        (activeFilters.priceRange !== "All" ? 1 : 0);

    return (
        <>
            <FilterOverlay
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={tempFilters}
                setFilters={setTempFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            <div className="container-page">
                {/* Header */}
                <header className="mb-8 sm:mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-serif text-3xl text-charcoal sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        Shop All Blooms
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="mx-auto mt-4 sm:mt-6 h-[1px] w-16 sm:w-24 bg-champagne"
                    />
                </header>

                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="sticky top-[72px] z-30 mb-8 sm:mb-12 flex flex-col items-center justify-between gap-3 sm:gap-4 border-b border-burgundy/10 bg-ivory/80 py-3 sm:pb-4 backdrop-blur-md md:flex-row md:pb-6"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleOpenFilters}
                            className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:shadow-luxury ${activeFilterCount > 0
                                ? "bg-burgundy text-white border-burgundy"
                                : "border-burgundy/20 text-charcoal hover:bg-burgundy hover:text-white"
                                }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-burgundy">
                                    {activeFilterCount}
                                </span>
                            )}
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
                        className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-12"
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
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
                        <p className="max-w-md text-charcoal/60 mb-6">
                            We couldn&apos;t find any arrangements matching your selected filters.
                            Try removing some filters to see more options.
                        </p>
                        <button
                            onClick={() => setActiveFilters(INITIAL_FILTERS)}
                            className="text-burgundy underline hover:text-burgundy/80 font-medium"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </>
    );
}
