import { MOCK_PRODUCTS, OCCASIONS } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug;
    const occasionData = OCCASIONS[slug as keyof typeof OCCASIONS];

    if (!occasionData) {
        return {
            title: "Occasion Not Found",
        };
    }

    return {
        title: `${occasionData.title} | Flower Pune`,
        description: occasionData.description,
    };
}

export default async function OccasionPage({ params }: PageProps) {
    const slug = (await params).slug;
    const occasionData = OCCASIONS[slug as keyof typeof OCCASIONS];

    if (!occasionData) {
        notFound();
    }

    // Filter products for this occasion
    const products = MOCK_PRODUCTS.filter((product) =>
        product.occasions?.includes(slug)
    );

    return (
        <div className="min-h-screen bg-ivory">
            {/* Editorial Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src={occasionData.heroImage}
                    alt={occasionData.title}
                    fill
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                    <h1 className="font-serif text-5xl font-medium tracking-tight md:text-7xl lg:text-8xl animate-fade-in-up">
                        {occasionData.title}
                    </h1>
                    <p className="mt-6 max-w-lg font-sans text-lg font-light leading-relaxed tracking-wide text-white/90 md:text-xl animate-fade-in-up delay-100">
                        {occasionData.subtitle}
                    </p>
                </div>
            </section>

            {/* Breadcrumb / Back Navigation */}
            <div className="container mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 transition-colors hover:text-burgundy"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Shop
                </Link>
            </div>

            {/* Product Grid */}
            <section className="container mx-auto max-w-[1280px] px-4 pb-24 sm:px-6 lg:px-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
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
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="font-serif text-xl text-charcoal/60">
                            Our curators are currently selecting the perfect blooms for this occasion.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Please checks back soon.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    return Object.keys(OCCASIONS).map((slug) => ({
        slug,
    }));
}
