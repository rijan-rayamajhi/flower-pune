"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/data";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleClose = () => {
        setQuery("");
        onClose();
    };

    // Filter logic
    const results = useMemo(() => {
        if (query.trim() === "") {
            return MOCK_PRODUCTS.slice(0, 4); // Show recent/popular by default
        }
        const lowerQuery = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery("");
        onClose();
        router.push(`/search?q=${encodeURIComponent(query)}`);
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
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-x-4 top-24 z-[101] mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:top-32"
                    >
                        {/* Search Header */}
                        <div className="relative border-b border-gray-100 p-6">
                            <form onSubmit={handleSearch} className="relative flex items-center">
                                <Search className="absolute left-4 h-6 w-6 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for bouquets, flowers..."
                                    className="h-14 w-full rounded-full bg-gray-50 pl-14 pr-12 text-lg text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                                    autoFocus
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        className="absolute right-4 p-1 text-gray-400 hover:text-burgundy transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-6">
                            {results.length > 0 ? (
                                <div className="space-y-6">
                                    <h3 className="font-serif text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {query ? "Search Results" : "Popular Suggestions"}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.href || `/product/${product.id}`}
                                                onClick={handleClose}
                                                className="group flex items-center gap-4 rounded-xl p-3 hover:bg-blush/30 transition-colors"
                                            >
                                                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-charcoal group-hover:text-burgundy transition-colors">
                                                        {product.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{product.category}</p>
                                                </div>
                                                <div className="font-medium text-burgundy">
                                                    ${product.price}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {query && results.length > 0 && (
                                        <div className="mt-4 flex justify-center border-t border-gray-100 pt-4">
                                            <button
                                                onClick={handleSearch}
                                                className="group flex items-center gap-2 text-sm font-medium text-burgundy hover:text-burgundy/80 transition-colors"
                                            >
                                                View all results
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-4 rounded-full bg-gray-50 p-4">
                                        <Search className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-charcoal">
                                        No results found
                                    </h3>
                                    <p className="mt-2 text-gray-500">
                                        We couldn&apos;t find anything matching &quot;{query}&quot;.<br />Try searching for &quot;Roses&quot; or &quot;Bouquets&quot;.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Close Button only meant for mobile mainly but useful for all */}
                        <div className="border-t border-gray-100 p-4 flex justify-end bg-gray-50/50">
                            <button
                                onClick={handleClose}
                                className="text-sm font-medium text-gray-500 hover:text-charcoal transition-colors"
                            >
                                Close (Esc)
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
