import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/supabase/products";
import ProductContent from "@/components/product/product-content";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

function ProductSkeleton() {
    return (
        <div className="bg-ivory pb-24 lg:pb-0">
            <div className="mx-auto max-w-[1440px] px-0 lg:px-8 lg:py-12">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-gray-200" />
                    </div>
                    <div className="px-4 lg:col-span-5 lg:px-0 space-y-6">
                        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
                        <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                        <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const id = (await params).id;
    const product = await getProductById(id);

    if (!product) {
        return { title: "Product Not Found | Flower Pune" };
    }

    return {
        title: `${product.name} | Flower Pune`,
        description: product.short_description || product.description || `Shop ${product.name} at Flower Pune.`,
    };
}

async function ProductPageContent({ params }: PageProps) {
    const id = (await params).id;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <ProductContent
            product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
                description: product.description,
                short_description: product.short_description,
                images: product.product_images || [],
                category: product.categories?.name || null,
            }}
        />
    );
}

export default function ProductPage({ params }: PageProps) {
    return (
        <Suspense fallback={<ProductSkeleton />}>
            <ProductPageContent params={params} />
        </Suspense>
    );
}
