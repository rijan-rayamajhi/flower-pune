import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative min-h-[80vh] flex items-center justify-center bg-ivory overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 left-[10%] w-80 h-80 bg-blush/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-champagne/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-burgundy/[0.03] rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 text-center px-4 sm:px-6">
                {/* Flower icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-burgundy/5 border border-burgundy/10">
                    <Flower2 strokeWidth={1.2} className="h-10 w-10 text-burgundy/60" />
                </div>

                {/* 404 Number */}
                <h1 className="font-serif text-[120px] sm:text-[160px] md:text-[200px] leading-none font-medium text-burgundy/10 select-none">
                    404
                </h1>

                {/* Message */}
                <div className="-mt-6 sm:-mt-8 md:-mt-10">
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal mb-3 sm:mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-charcoal/60 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-light mb-8 sm:mb-10">
                        The page you&apos;re looking for seems to have wilted away.
                        Let us help you find something beautiful.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                        href="/"
                        className="btn-primary h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base shadow-luxury hover:scale-[1.02] group"
                    >
                        Back to Home
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/shop"
                        className="btn-outline h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base"
                    >
                        Browse the Shop
                    </Link>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center justify-center mt-12 sm:mt-16">
                    <div className="h-px w-12 bg-champagne/40" />
                    <div className="mx-4 h-1.5 w-1.5 rounded-full bg-champagne/60" />
                    <div className="h-px w-12 bg-champagne/40" />
                </div>
            </div>
        </main>
    );
}
