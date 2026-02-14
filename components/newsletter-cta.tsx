"use client";

import { FadeIn } from "@/components/ui/motion";
import { Send } from "lucide-react";

export default function NewsletterCTA() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blush/40 via-ivory to-blush/30 relative overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-0 left-[20%] w-64 h-64 rounded-full bg-burgundy/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-48 h-48 rounded-full bg-champagne/10 blur-[80px] pointer-events-none" />

            <div className="relative mx-auto max-w-2xl text-center">
                <FadeIn>
                    {/* Gold Divider */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="h-px w-12 bg-champagne/60" />
                        <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne" />
                        <div className="h-px w-12 bg-champagne/60" />
                    </div>

                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-burgundy/70 mb-3">
                        Stay in Bloom
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
                        Join Our Garden
                    </h2>
                    <p className="text-charcoal/60 text-lg mb-10 font-serif italic">
                        Get exclusive offers, seasonal inspirations, and early access to new collections.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 h-14 px-6 rounded-full border border-burgundy/15 bg-white/80 backdrop-blur-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy/30 transition-all duration-300 text-sm"
                        />
                        <button
                            type="submit"
                            className="btn-primary h-14 px-8 text-sm shadow-luxury hover:scale-[1.02] shrink-0"
                        >
                            Subscribe
                            <Send className="h-4 w-4" />
                        </button>
                    </form>

                    <p className="text-xs text-charcoal/40 mt-4">
                        No spam, ever. Unsubscribe anytime.
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
