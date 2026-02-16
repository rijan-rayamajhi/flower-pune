import { Suspense } from "react";
import { getProducts } from "@/lib/supabase/products";
import { toProductCardData } from "@/lib/types/product";
import ShopContent from "@/components/shop/shop-content";

function ShopSkeleton() {
    return (
        <main className="min-h-screen bg-ivory pb-20 pt-24 sm:pt-32">
            <div className="container-page">
                {/* Header skeleton */}
                <div className="mb-8 sm:mb-12 text-center">
                    <div className="mx-auto h-10 w-64 animate-pulse rounded bg-gray-200" />
                    <div className="mx-auto mt-4 h-[1px] w-16 sm:w-24 animate-pulse bg-gray-200" />
                </div>
                {/* Grid skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[3/4] animate-pulse rounded-xl sm:rounded-2xl bg-gray-200" />
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                            <div className="flex justify-between">
                                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                                <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

async function ShopPageContent() {
    const products = await getProducts({ sort: "newest" });
    const productCards = products.map(toProductCardData);

    return (
        <main className="min-h-screen bg-ivory pb-20 pt-24 sm:pt-32">
            <ShopContent products={productCards} />
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopPageContent />
        </Suspense>
    );
}
