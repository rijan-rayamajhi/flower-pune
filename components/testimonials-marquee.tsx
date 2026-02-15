"use client";

import { Star } from "lucide-react";
import SectionTitle from "@/components/ui/section-title";

const testimonials = [
    {
        name: "Priya M.",
        text: "The bridal bouquet was absolutely breathtaking. Every detail was perfect.",
        rating: 5,
    },
    {
        name: "Ananya S.",
        text: "Flower Pune has become our go-to for every celebration. Truly exceptional quality.",
        rating: 5,
    },
    {
        name: "Rahul K.",
        text: "The anniversary arrangement left my wife speechless. Worth every rupee.",
        rating: 5,
    },
    {
        name: "Meera D.",
        text: "Same-day delivery and the flowers were still fresh three weeks later!",
        rating: 5,
    },
    {
        name: "Vikram P.",
        text: "Their custom bouquets for our wedding were a work of art. Highly recommend.",
        rating: 5,
    },
    {
        name: "Sanya R.",
        text: "The sympathy arrangement was so elegant and thoughtful. Beautiful craftsmanship.",
        rating: 5,
    },
];

// Double the testimonials for infinite scroll effect
const doubledTestimonials = [...testimonials, ...testimonials];

export default function TestimonialsMarquee() {
    return (
        <section className="py-14 md:py-20 bg-gradient-to-b from-white to-ivory overflow-hidden relative">
            <SectionTitle
                subtitle="What Our Clients Say"
                title="Loved by Hundreds"
                className="mb-8 md:mb-12 px-4"
            />

            {/* Marquee Track */}
            <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none" />

                <div className="flex gap-4 sm:gap-6 animate-marquee">
                    {doubledTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[340px] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-blush/30 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex gap-1 mb-3">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} className="h-4 w-4 fill-champagne text-champagne" />
                                ))}
                            </div>
                            <p className="text-charcoal/80 text-sm leading-relaxed mb-4 italic font-serif">
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
