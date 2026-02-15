"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import { MOCK_PRODUCTS } from "@/lib/data";
import { motion } from "framer-motion";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const results = useMemo(() => {
        if (!query) return [];

        const lowerQuery = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
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
                <p className="mt-3 text-gray-500">
                    We found {results.length} {results.length === 1 ? 'result' : 'results'} matching your search.
                </p>
            </div>

            {results.length > 0 ? (
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
