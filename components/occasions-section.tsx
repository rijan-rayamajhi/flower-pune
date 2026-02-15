"use client";

import Image from "next/image";
import Link from "next/link";
import { OCCASIONS } from "@/lib/data";
import { FadeIn } from "@/components/ui/motion";
import { ArrowRight } from "lucide-react";

const selectedOccasions = [
    { key: "birthday", ...OCCASIONS.birthday, href: "/occasions/birthday" },
    { key: "anniversary", ...OCCASIONS.anniversary, href: "/occasions/anniversary" },
    { key: "wedding", ...OCCASIONS.wedding, href: "/occasions/wedding" },
    { key: "romance", ...OCCASIONS.romance, href: "/occasions/romance" }
];

export default function OccasionsSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-ivory via-blush/10 to-ivory relative overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-10 left-[5%] w-64 h-64 rounded-full bg-blush/15 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-[5%] w-48 h-48 rounded-full bg-champagne/10 blur-[80px] pointer-events-none" />

            <div className="container-page relative">
                {/* Gold Divider */}
                <div className="flex items-center justify-center mb-8 md:mb-12">
                    <div className="h-px w-12 bg-champagne/60" />
                    <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne" />
                    <div className="h-px w-12 bg-champagne/60" />
                </div>

                <FadeIn>
                    <div className="mb-8 md:mb-12 text-center">
                        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-burgundy/70 mb-3">
                            For Every Moment
                        </p>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-charcoal mb-3 sm:mb-4">Shop by Occasion</h2>
                        <p className="text-charcoal/60 max-w-2xl mx-auto font-serif italic text-base sm:text-lg">
                            Find the perfect blooms for life&apos;s most memorable moments.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {selectedOccasions.map((occasion, index) => (
                        <FadeIn key={occasion.key} delay={index * 0.1} className="h-full">
                            <Link
                                href={occasion.href}
                                className="group relative block w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-500"
                            >
                                {/* Background Image */}
                                <Image
                                    src={occasion.heroImage}
                                    alt={occasion.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 group-hover:from-burgundy/70 group-hover:via-burgundy/20" />

                                {/* Content */}
                                <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-end text-white">
                                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <div className="h-px w-6 sm:w-8 bg-champagne/60 mb-2 sm:mb-3 transition-all duration-500 group-hover:w-12 group-hover:bg-champagne" />
                                        <h3 className="font-serif text-sm sm:text-lg md:text-2xl font-medium mb-0.5 sm:mb-1">{occasion.title}</h3>
                                        <p className="text-white/70 text-xs sm:text-sm font-light line-clamp-1 hidden sm:block">
                                            {occasion.subtitle}
                                        </p>
                                    </div>

                                    {/* Hover CTA */}
                                    <div className="translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 mt-4">
                                        <div className="flex items-center gap-2 text-sm font-medium tracking-wide border-b border-white/50 pb-1 w-fit">
                                            Shop Now <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
