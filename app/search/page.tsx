"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { ProductCardData } from "@/lib/types/product";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<ProductCardData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("products")
                    .select(`
                        *,
                        categories (*),
                        product_images (*)
                    `)
                    .eq("is_active", true)
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                    .order("created_at", { ascending: false })
                    .limit(20);

                if (error) {
                    console.error("Search error:", error);
                    setResults([]);
                    return;
                }

                const mapped: ProductCardData[] = (data || []).map((product) => {
                    const primaryImage = product.product_images?.find((img: { is_primary: boolean }) => img.is_primary);
                    const firstImage = product.product_images?.[0];
                    return {
                        id: product.id,
                        title: product.name,
                        price: Number(product.price),
                        image: primaryImage?.image_url || firstImage?.image_url || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
                        category: product.categories?.name,
                        href: `/product/${product.id}`,
                        stockQuantity: product.stock_quantity ?? 0,
                    };
                });

                setResults(mapped);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="font-serif text-3xl font-medium text-charcoal md:text-4xl text-balance">
                    Search our collection
                </h1>
                <p className="mt-4 max-w-md text-gray-500">
                    Find the perfect arrangement for any occasion. Try searching for &quot;Roses&quot;, &quot;Birthdays&quot;, or &quot;Summer&quot;.
                </p>
            </div>
        );
    }

    return (
        <div className="pb-20 pt-24 sm:pt-32 container-page min-h-[60vh]">
            <div className="mb-8 sm:mb-12 text-center md:text-left">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal md:text-4xl">
                    Results for <span className="text-burgundy italic">&quot;{query}&quot;</span>
                </h1>
                {!isLoading && (
                    <p className="mt-3 text-gray-500">
                        We found {results.length} {results.length === 1 ? 'result' : 'results'} matching your search.
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200" />
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {results.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            href={product.href}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100"
                >
                    <div className="mb-6 rounded-full bg-white p-6 shadow-sm">
                        <Search className="h-10 w-10 text-gray-300" />
                    </div>
                    <h2 className="font-serif text-2xl font-medium text-charcoal">
                        No matches found
                    </h2>
                    <p className="mt-2 max-w-sm text-gray-500">
                        We couldn&apos;t find any products matching &quot;{query}&quot;. Try adjusting your search or browse our popular categories.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-burgundy shadow-lg hover:shadow-xl"
                    >
                        Browse Shop
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50" />}>
            <SearchContent />
        </Suspense>
    );
}
