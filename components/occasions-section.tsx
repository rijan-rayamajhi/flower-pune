"use client";

import Image from "next/image";
import Link from "next/link";
import { OCCASIONS } from "@/lib/data";
import { FadeIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const selectedOccasions = [
    { key: "birthday", ...OCCASIONS.birthday, href: "/occasions/birthday" },
    { key: "anniversary", ...OCCASIONS.anniversary, href: "/occasions/anniversary" },
    { key: "wedding", ...OCCASIONS.wedding, href: "/occasions/wedding" },
    { key: "romance", ...OCCASIONS.romance, href: "/occasions/romance" }
];

export default function OccasionsSection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory">
            <div className="mx-auto max-w-[1280px]">
                <FadeIn>
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">Shop by Occasion</h2>
                        <p className="text-charcoal/70 max-w-2xl mx-auto">
                            Find the perfect blooms for life&apos;s most memorable moments.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedOccasions.map((occasion, index) => (
                        <FadeIn key={occasion.key} delay={index * 0.1} className="h-full">
                            <Link
                                href={occasion.href}
                                className="group relative block w-full aspect-[4/5] overflow-hidden rounded-sm"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:bg-burgundy/40" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className="font-serif text-2xl font-medium mb-2">{occasion.title}</h3>
                                        <p className="text-white/90 text-sm font-light opacity-100 transition-opacity duration-300 group-hover:opacity-0 absolute bottom-0 translate-y-8">
                                            {occasion.subtitle}
                                        </p>
                                    </div>

                                    {/* Hover CTA */}
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
