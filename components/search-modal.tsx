"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
    id: string;
    title: string;
    price: number;
    image: string;
    category?: string;
    href: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
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

    // Debounced search
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            // Show popular/newest products when query is empty
            setIsLoading(true);
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from("products")
                    .select(`*, categories (*), product_images (*)`)
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(4);

                const mapped: SearchResult[] = (data || []).map((product) => {
                    const primaryImage = product.product_images?.find((img: { is_primary: boolean }) => img.is_primary);
                    const firstImage = product.product_images?.[0];
                    return {
                        id: product.id,
                        title: product.name,
                        price: Number(product.price),
                        image: primaryImage?.image_url || firstImage?.image_url || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
                        category: product.categories?.name,
                        href: `/product/${product.id}`,
                    };
                });

                setResults(mapped);
                setHasSearched(false);
            } catch (err) {
                console.error("Error loading suggestions:", err);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("products")
                .select(`*, categories (*), product_images (*)`)
                .eq("is_active", true)
                .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
                .order("created_at", { ascending: false })
                .limit(6);

            if (error) {
                console.error("Search error:", error);
                setResults([]);
                return;
            }

            const mapped: SearchResult[] = (data || []).map((product) => {
                const primaryImage = product.product_images?.find((img: { is_primary: boolean }) => img.is_primary);
                const firstImage = product.product_images?.[0];
                return {
                    id: product.id,
                    title: product.name,
                    price: Number(product.price),
                    image: primaryImage?.image_url || firstImage?.image_url || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
                    category: product.categories?.name,
                    href: `/product/${product.id}`,
                };
            });

            setResults(mapped);
        } catch (err) {
            console.error("Search error:", err);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounce effect
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            searchProducts(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, isOpen, searchProducts]);

    const handleClose = () => {
        setQuery("");
        setHasSearched(false);
        onClose();
    };

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
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-burgundy/50" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-6">
                                    <h3 className="font-serif text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {hasSearched ? "Search Results" : "Popular Suggestions"}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.href}
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
                                                    ₹{product.price}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {hasSearched && results.length > 0 && (
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
                            ) : hasSearched ? (
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
                            ) : null}
                        </div>

                        {/* Footer / Close Button */}
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
