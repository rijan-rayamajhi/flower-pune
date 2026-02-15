"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/motion";
import SectionTitle from "@/components/ui/section-title";
import { ArrowRight, Flower2, Palette, PenLine } from "lucide-react";

const steps = [
    {
        icon: Flower2,
        step: "01",
        label: "Choose Flowers",
        description: "Select from our premium collection of seasonal blooms.",
    },
    {
        icon: Palette,
        step: "02",
        label: "Pick the Style",
        description: "Choose your arrangement style and vessel.",
    },
    {
        icon: PenLine,
        step: "03",
        label: "Add a Message",
        description: "Personalize with a heartfelt message.",
    },
];

export default function CustomizePromo() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Full-bleed background image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=2000&auto=format&fit=crop"
                    alt="Florist carefully arranging a bespoke bouquet with premium roses"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-[2px]" />
            </div>

            {/* Decorative light orbs */}
            <div className="absolute top-10 left-[15%] w-72 h-72 bg-burgundy/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-champagne/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container-page">
                {/* Header */}
                <SectionTitle
                    subtitle="Bespoke Floral Experience"
                    title="Design Your Own"
                    titleHighlight="Masterpiece"
                    description="Create a floral arrangement that perfectly captures your sentiment. Choose from our premium selection of stems, foliage, and vessels to craft a unique expression of love."
                    variant="dark"
                    className="mb-12 md:mb-16"
                />

                {/* Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 md:mb-16 max-w-4xl mx-auto">
                    {steps.map((item, index) => (
                        <FadeIn key={item.step} delay={index * 0.15}>
                            <div className="group text-center px-4 py-8 sm:py-10 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.1] hover:border-white/20">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/10 group-hover:bg-burgundy/30 transition-colors duration-500">
                                    <item.icon className="h-6 w-6 text-champagne" />
                                </div>
                                <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-champagne/60 mb-2">
                                    Step {item.step}
                                </span>
                                <h3 className="font-serif text-lg sm:text-xl text-white mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed max-w-[200px] mx-auto">
                                    {item.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* CTA Buttons */}
                <FadeIn delay={0.5}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/customize"
                            className="btn-primary h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base shadow-luxury hover:scale-[1.02] group"
                        >
                            Start Creating
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center border border-white/30 text-white h-12 sm:h-14 px-8 sm:px-10 rounded-sm text-sm sm:text-base font-medium transition-all duration-300 hover:bg-white hover:text-charcoal hover:scale-[1.02]"
                        >
                            Browse Collection
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
