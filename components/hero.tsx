import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/motion";

export default function Hero() {
    return (
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
            {/* Full-bleed background image */}
            <Image
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=2000&auto=format&fit=crop"
                alt="Lush arrangement of premium roses and peonies"
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />

            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

            {/* Decorative bokeh blobs */}
            <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blush/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-32 right-[15%] w-48 h-48 rounded-full bg-champagne/15 blur-[80px] pointer-events-none" />
            <div className="absolute top-1/3 right-[8%] w-32 h-32 rounded-full bg-burgundy/10 blur-[60px] pointer-events-none" />

            {/* Content - Centered */}
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <SlideIn delay={0.25} direction="up">
                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] text-white drop-shadow-lg">
                        Curating nature&apos;s{" "}
                        <span className="italic text-blush">finest poetry</span>
                        <br className="hidden sm:block" />
                        {" "}for your moments.
                    </h1>
                </SlideIn>

                <FadeIn delay={0.5}>
                    <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-white/80 font-light">
                        Bespoke floral narratives that transform spaces and elevate emotions.
                        Experience the art of botanical luxury.
                    </p>
                </FadeIn>

                <FadeIn delay={0.7}>
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/shop"
                            className="btn-primary h-14 px-10 text-base shadow-luxury hover:scale-[1.02] group"
                        >
                            Shop the Collection
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/customize"
                            className="inline-flex items-center justify-center border border-white/40 text-white h-14 px-10 rounded-sm text-base font-medium transition-all duration-300 hover:bg-white hover:text-charcoal hover:scale-[1.02]"
                        >
                            Customize Bouquet
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
