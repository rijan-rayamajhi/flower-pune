"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";

export default function CustomizePromo() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory overflow-hidden">
            <div className="mx-auto max-w-[1280px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Column */}
                    <FadeIn delay={0.2} className="relative aspect-[4/5] lg:aspect-square w-full h-full min-h-[400px]">
                        <div className="absolute inset-0 rounded-sm overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1200&auto=format&fit=crop"
                                alt="Florist arranging a bespoke bouquet"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Overlay for better text contrast if we had text on top, but here it's just style */}
                            <div className="absolute inset-0 bg-black/5" />
                        </div>
                        {/* Decorative elem */}
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-burgundy/10 rounded-full blur-2xl" />
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-champagne/20 rounded-full blur-3xl" />
                    </FadeIn>

                    {/* Content Column */}
                    <div className="flex flex-col justify-center">
                        <FadeIn delay={0.4}>
                            <span className="text-burgundy font-medium tracking-wide uppercase text-sm mb-4 block">
                                Bespoke Floral Experience
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                                Design Your Own <br className="hidden md:block" /> Masterpiece
                            </h2>
                            <p className="text-charcoal/70 text-lg mb-8 leading-relaxed max-w-xl">
                                Create a floral arrangement that perfectly captures your sentiment.
                                Choose from our premium selection of stems, foliage, and vessels
                                to craft a unique expression of your love, gratitude, or celebration.
                            </p>

                            <Link
                                href="/customize"
                                className="inline-flex items-center justify-center bg-burgundy text-white px-8 py-4 rounded-sm hover:bg-burgundy/90 transition-all duration-300 shadow-md hover:shadow-lg group w-fit"
                            >
                                <span className="font-medium">Create Your Bouquet</span>
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
