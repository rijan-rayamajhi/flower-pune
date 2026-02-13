"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useEffect } from "react";

export interface FilterState {
    categories: string[];
    occasions: string[];
    priceRange: string;
}

interface FilterOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    onApply: () => void;
    onClear: () => void;
}

const CATEGORIES = ["Roses", "Lilies", "Orchids", "Tulips", "Sunflowers", "Mixed", "Bouquets", "Peonies", "Plants"];
const OCCASIONS = [
    "Birthday", "Anniversary", "Wedding", "Get Well", "Thank You",
    "Romance", "Sympathy", "Mother's Day", "Spring", "Congratulations",
    "Luxury", "Corporate"
];
const PRICE_Ranges = ["All", "$0 - $50", "$50 - $100", "$100 - $200", "$200+"];

export default function FilterOverlay({ isOpen, onClose, filters, setFilters, onApply, onClear }: FilterOverlayProps) {
    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const toggleOccasion = (occasion: string) => {
        const newOccasions = filters.occasions.includes(occasion)
            ? filters.occasions.filter(o => o !== occasion)
            : [...filters.occasions, occasion];
        setFilters({ ...filters, occasions: newOccasions });
    };

    const setPriceRange = (range: string) => {
        setFilters({ ...filters, priceRange: range });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-ivory shadow-2xl p-6 overflow-y-auto flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-serif text-2xl text-charcoal">Filters</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-charcoal/60 hover:text-burgundy transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Filter Sections */}
                        <div className="space-y-8 flex-1">
                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50 mb-4">Category</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => toggleCategory(cat)}
                                                className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${filters.categories.includes(cat)
                                                    ? "bg-burgundy border-burgundy"
                                                    : "border-burgundy/20 group-hover:border-burgundy"
                                                    }`}
                                            >
                                                {filters.categories.includes(cat) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                            </div>
                                            <span className="text-charcoal group-hover:text-burgundy transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Occasions (Replaces Colors) */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50 mb-4">Occasion</h3>
                                <div className="flex flex-wrap gap-2">
                                    {OCCASIONS.map((occasion) => (
                                        <button
                                            key={occasion}
                                            onClick={() => toggleOccasion(occasion)}
                                            className={`px-3 py-1.5 rounded-full border text-sm transition-all ${filters.occasions.includes(occasion)
                                                ? "bg-burgundy text-white border-burgundy shadow-sm"
                                                : "border-burgundy/10 text-charcoal hover:border-burgundy hover:text-burgundy bg-white"
                                                }`}
                                        >
                                            {occasion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50 mb-4">Price Range</h3>
                                <div className="space-y-2">
                                    {PRICE_Ranges.map((range) => (
                                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => setPriceRange(range)}
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.priceRange === range
                                                    ? "border-burgundy"
                                                    : "border-burgundy/20 group-hover:border-burgundy"
                                                    }`}
                                            >
                                                {filters.priceRange === range && <div className="w-2.5 h-2.5 bg-burgundy rounded-full" />}
                                            </div>
                                            <span className="text-charcoal group-hover:text-burgundy transition-colors">{range}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-6 border-t border-burgundy/10 flex gap-4">
                            <button
                                onClick={onClear}
                                className="flex-1 py-3 text-sm font-medium text-charcoal/60 hover:text-burgundy transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => { onApply(); onClose(); }}
                                className="flex-1 py-3 bg-burgundy text-white font-medium text-sm rounded-sm hover:bg-burgundy/90 transition-colors shadow-luxury"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
