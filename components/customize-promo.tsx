"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";

export default function CustomizePromo() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-ivory via-blush/20 to-ivory overflow-hidden relative">
            {/* Decorative background orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blush/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="mx-auto max-w-[1280px] relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Column */}
                    <FadeIn delay={0.2} className="relative aspect-[4/5] lg:aspect-square w-full h-full min-h-[400px]">
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                            <Image
                                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=1200&auto=format&fit=crop"
                                alt="Florist carefully arranging a bespoke bouquet with premium roses"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-burgundy/10 rounded-full blur-2xl" />
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-champagne/15 rounded-full blur-3xl" />
                    </FadeIn>

                    {/* Content Column */}
                    <div className="flex flex-col justify-center">
                        <FadeIn delay={0.4}>
                            <span className="text-burgundy font-medium tracking-[0.15em] uppercase text-sm mb-4 block">
                                Bespoke Floral Experience
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
                                Design Your Own <br className="hidden md:block" /> <span className="italic text-burgundy">Masterpiece</span>
                            </h2>
                            <p className="text-charcoal/70 text-lg mb-10 leading-relaxed max-w-xl">
                                Create a floral arrangement that perfectly captures your sentiment.
                                Choose from our premium selection of stems, foliage, and vessels
                                to craft a unique expression of your love, gratitude, or celebration.
                            </p>

                            {/* Step indicators */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10">
                                {[
                                    { step: "1", label: "Choose Flowers" },
                                    { step: "2", label: "Pick the Style" },
                                    { step: "3", label: "Add a Message" },
                                ].map((item, i) => (
                                    <div key={item.step} className="flex items-center gap-3">
                                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-burgundy/10 text-burgundy text-sm font-semibold shrink-0">
                                            {item.step}
                                        </span>
                                        <span className="text-sm font-medium text-charcoal/80">{item.label}</span>
                                        {i < 2 && (
                                            <ArrowRight className="h-3.5 w-3.5 text-champagne hidden sm:block ml-1" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/customize"
                                className="btn-primary py-4 px-8 text-base shadow-luxury hover:scale-[1.02] group w-fit"
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
